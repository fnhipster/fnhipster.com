import { config } from 'https://deno.land/x/dotenv@v3.2.2/mod.ts';

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = config();

export async function getSpotifyTokens() {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error(
      'Missing Spotify Client ID or Client Secret. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.'
    );
  }

  const token = JSON.parse(sessionStorage.getItem('spotify-token') || '{}');

  if (token.expiresAt > Date.now()) {
    return token;
  }

  return await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      )}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
    .then((res) => res.json())
    .then(({ token_type, access_token, expires_in }) => {
      const data = {
        tokenType: token_type,
        accessToken: access_token,
        expiresAt: Date.now() + expires_in * 1000,
      };

      sessionStorage.setItem('spotify-token', JSON.stringify(data));

      return data;
    });
}

export async function getSpotifyPlaylist(id: string) {
  const { tokenType, accessToken } = await getSpotifyTokens();

  const endpoint = new URL(`https://api.spotify.com/v1/playlists/${id}`);

  endpoint.searchParams.set('market', 'US');

  endpoint.searchParams.set(
    'fields',
    'name, description, external_urls(spotify), tracks(items(track(name, artists(name), album(name))))'
  );

  const res = await fetch(endpoint, {
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
  });

  const data = await res.json();

  return {
    name: data.name,
    description: data.description,
    url: data.external_urls.spotify,
    tracks: data.tracks.items.map((item: any) => {
      return {
        name: item.track.name,
        artists: item.track.artists
          .map((artist: any) => artist.name)
          .join(', '),
        album: item.track.album.name,
      };
    }),
  };
}
