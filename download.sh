# ffmpeg \
# -headers "referer: https://kwik.cx/e/XLMiKAAhJSBc" \
# -i "https://eu2-cdn.nextstream.org/stream/0000/8fc8d1e6827a362a480bd2f787db7e05098b1c2c582bb2434cc11785c95cd33f/uwu.m3u8?token=uf58U8xdtkXAHqYf1clwpA&expires=1583654491" \
# -c copy -bsf:a aac_adtstoasc \
# "Watch Boku no Hero Academia 4th Season - 64 Online.mp4"

download() {
    ffmpeg -headers "referer: https://kwik.cx/e/XLMiKAAhJSBc" -i "$1" -c copy -bsf:a aac_adtstoasc "$2" < /dev/null
}

while read -r line; do
    video=($line)
    name=${video[0]}
    url=${video[1]}
    download $url $name &
done < "$1"