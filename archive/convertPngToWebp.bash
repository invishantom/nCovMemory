for file in png/*
do
id=`echo "$file" | cut -c 5- | cut -d'.' -f1`
if [ -f "webp/$id.webp" ];then
        echo "$file.webp already exist, skip!"
else
echo Converting $file ...
cwebp -q 80 "$file" -o "webp/$id.webp"
fi
done