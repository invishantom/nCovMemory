for file in png/*
do
if [ ! -d jpg ];then
        mkdir jpg
fi
id=`echo "$file" | cut -c 5- | cut -d'.' -f1`
if [ -f "jpg/$id.jpg" ];then
        echo "$file.jpg already exist, skip!"
else
echo Converting $file ...
gm convert -compress BZip "$file" "jpg/$id.jpg" 
fi
done