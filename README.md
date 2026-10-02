# Sanchez IT Essentials Class Song Queue

Students request school-safe songs; the teacher reviews them and queues them on Spotify.

- **Student page:** `index.html`: search, request (share by link or QR code)
- **Teacher page:** `teacher.html`: see requests, queue them on Spotify in one click (or open them in Spotify), mark queued/rejected, show the QR code

## How songs are filtered

1. Song search uses the Apple Music/iTunes catalog. Any track Apple marks **explicit** is blocked.
2. Titles, artists and albums are checked against word lists for profanity, drugs/alcohol and violence (`filter.js`).
3. Some well-known songs with harmless-looking titles are blocked by name (`knownSongs` in `filter.js`).
4. Lyrics are looked up on lrclib.net and scanned with the same lists. School web filters often block
   lyric sites. When that happens the request still goes through, and the teacher page labels it
   **Lyrics not checked** so you know to review it.

No filter is perfect. The teacher's review is the final check.

## How requests get to the teacher

Requests are sent through [ntfy.sh](https://ntfy.sh), a free message relay that needs no account. It keeps
messages for about 12 hours. The teacher page saves everything it receives in that browser, so open it at
least once a school day. The topic name is in `config.js`; change it to start a fresh queue.

## One-click Spotify queueing

The teacher page can add a song straight to the end of your Spotify queue with **▶ Queue**. It needs
Spotify Premium and a one-time setup:

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard), log in with the Spotify
   account that plays music in class, and click **Create app**.
2. Name and description can be anything. For **Redirect URI**, enter the exact address of the teacher page,
   e.g. `https://iyannm.github.io/sanchez-it-essentials-song-queue/teacher.html`. Tick **Web API** and save.
3. In the app's **User Management**, add the email of that same Spotify account.
4. Copy the app's **Client ID** into `spotifyClientId` in `config.js` (it is not a secret).
5. On the teacher page, click **Connect Spotify** and approve. This browser stays connected.

Spotify only accepts queue requests while it is open and playing (or paused) on some device. The page
always picks a non-explicit version and refuses if Spotify only has an explicit one.

## Settings

Edit `config.js` to change the per-student request limit.
