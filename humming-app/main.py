import base64
import hashlib
import hmac
import os
import time
import urllib.parse

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse

load_dotenv()

ACRCLOUD_HOST = os.getenv("ACRCLOUD_HOST", "")
ACRCLOUD_ACCESS_KEY = os.getenv("ACRCLOUD_ACCESS_KEY", "")
ACRCLOUD_ACCESS_SECRET = os.getenv("ACRCLOUD_ACCESS_SECRET", "")

app = FastAPI()


def _acrcloud_signature(method: str, uri: str, timestamp: int) -> str:
    string_to_sign = "\n".join([
        method, uri,
        ACRCLOUD_ACCESS_KEY, "humming", "1",
        str(timestamp),
    ])
    digest = hmac.new(
        ACRCLOUD_ACCESS_SECRET.encode("ascii"),
        string_to_sign.encode("ascii"),
        digestmod=hashlib.sha1,
    ).digest()
    return base64.b64encode(digest).decode("ascii")


@app.post("/identify")
async def identify(audio: UploadFile = File(...)):
    if not ACRCLOUD_HOST or not ACRCLOUD_ACCESS_KEY or not ACRCLOUD_ACCESS_SECRET:
        raise HTTPException(status_code=500, detail="ACRCloud credentials not configured")

    audio_bytes = await audio.read()
    if len(audio_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty audio file")

    timestamp = int(time.time())
    uri = "/v1/identify"
    signature = _acrcloud_signature("POST", uri, timestamp)

    form_data = {
        "access_key": ACRCLOUD_ACCESS_KEY,
        "sample_bytes": str(len(audio_bytes)),
        "timestamp": str(timestamp),
        "signature": signature,
        "data_type": "humming",
        "signature_version": "1",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"https://{ACRCLOUD_HOST}{uri}",
            data=form_data,
            files={"sample": ("audio.webm", audio_bytes, audio.content_type or "audio/webm")},
        )

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"ACRCloud error: {resp.text}")

    data = resp.json()
    status = data.get("status", {})
    if status.get("code") != 0:
        msg = status.get("msg", "No match found")
        return JSONResponse({"matched": False, "message": msg})

    music = data["metadata"]["music"][0]
    title = music.get("title", "Unknown")
    artists = [a["name"] for a in music.get("artists", [])]
    artist = ", ".join(artists) if artists else "Unknown"

    # Prefer ACRCloud's Spotify link; fall back to search URL
    external = music.get("external_metadata", {})
    spotify_data = external.get("spotify", {})
    track_id = (spotify_data.get("track") or {}).get("id")
    if track_id:
        spotify_url = f"https://open.spotify.com/track/{track_id}"
    else:
        query = urllib.parse.quote(f"{title} {artist}")
        spotify_url = f"https://open.spotify.com/search/{query}"

    return JSONResponse({
        "matched": True,
        "title": title,
        "artist": artist,
        "spotify_url": spotify_url,
        "album": music.get("album", {}).get("name", ""),
        "score": music.get("score", 0),
    })


@app.get("/")
async def index():
    return FileResponse(os.path.join(os.path.dirname(__file__), "index.html"))
