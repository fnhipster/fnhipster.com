import { getSpotifyPlaylist } from '../../../lib/spotify.ts';

export default async () => {
  const playlist = await getSpotifyPlaylist('1UBGNGzalFpudl1gseZ9Jd');

  return {
    meta: {
      title: playlist?.name,
      description: playlist?.description,
      index: true,
    },

    title: playlist?.name,
    tracks: playlist?.tracks,
    url: playlist?.url,
  };
};
