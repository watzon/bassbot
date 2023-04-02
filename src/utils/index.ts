import fetch from "isomorphic-unfetch";
import spotify from "spotify-url-info";

export function generateInviteLink(): string | null {
  const clientId = process.env.CLIENT_ID;
  const permissions = process.env.PERMISSIONS;
  const scope = process.env.SCOPE;

  if (!clientId || !permissions || !scope) {
    console.warn("Cannot create invite link without the environment variables CLIENT_ID, PERMISSIONS, and SCOPE");
    return null;
  }

  const encodedScope = encodeURIComponent(scope);
  return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=${encodedScope}`;
}

export const SPOTIFY_TRACK_RE = /^https?:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+/;

export async function getTrackData(trackLink: string): Promise<any> {
    // Validate the track link
    if (!SPOTIFY_TRACK_RE.test(trackLink)) {
        console.error(`Invalid Spotify track link: ${trackLink}`);
        return null;
    }

    try {
        const trackData = await spotify(fetch).getData(trackLink);
        console.log(trackData);
        return trackData;
    } catch (error) {
        console.error(`Failed to fetch track data for track: ${trackLink}`);
        console.error(error);
        return null;
    }
}
