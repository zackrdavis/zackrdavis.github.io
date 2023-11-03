<?php
$dir = "files";

// run the scan
$response = scan($dir);

// recursive scan function
function scan($dir){
	$files = array();

	// Is there actually such a folder/file?
	if(file_exists($dir)){
		foreach(scandir($dir) as $f) {
			if(!$f || $f[0] == '.') {
				continue; // Ignore hidden files
			}

			if(is_dir($dir . '/' . $f)) {
				// The path is a folder
				$files[] = array(
					"name" => $f,
					"type" => "folder",
					"path" => $dir . '/' . $f,
					"items" => scan($dir . '/' . $f) // Recursively get the contents of the folder
				);
			}

			else {
				// it's a file
				$files[] = array(
					"name" => $f,
					"type" => "file",
					"path" => $dir . '/' . $f,
					"size" => filesize($dir . '/' . $f),
          "modified" => filemtime($dir . '/' . $f)
				);
			}
		}
	}

	return $files;
}

// Output the directory listing as JSON
header('Content-type: application/json');

echo json_encode(array(
	"name" => "Data",
	"type" => "folder",
	"path" => $dir,
	"items" => $response
));
