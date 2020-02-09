for file in png/*
do
if [ ! -d $1 ];then
        mkdir $1
fi
id=`echo "$file" | cut -c 5- | cut -d'.' -f1`
if [ -f "$1/$id.heic" ];then
        echo "$file.$1 already exist, skip!"
else
echo Converting $file ...
gm convert -compress BZip "$file" "$1/$id.$1" 
fi
done