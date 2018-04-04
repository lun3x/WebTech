cd ../site/public

for page in *.html;
do
  curl -0 localhost:8080/$page -o ../../test/$page
done

cd ../../test

for file in *.html
do
  mv "$file" "${file%.html}.xhtml"
done

for file in *.xhtml
do
  echo java -jar ../dist/vnu.jar file
done
