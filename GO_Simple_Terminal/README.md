<h1> Simple Shell Application </h1>

Here I build a simple shell that accepts commands that run certain OS functions. The OS functions use golang's built-in OS and ioutil packages.

The terminal application has the following functions:
<ul>
<li> exit </li>
<ul><li> exit the program </li></ul>
<li> cd [path] </li>
<ul><li> change directory to a specified path </li></ul>
<li> ls </li>
<ul><li> list items and files in the current path </li></ul>
<li> mkdir [path] </li>
<ul><li> create a directory with the specified path </li></ul>
<li> rm [path] </li>
<ul><li> remove a specified file or folder </li></ul>
<li> create [path] </li>
<ul><li> create a file with a specified name </li></ul>
<li> cat [file] </li>
<ul><li> show the contents of a specified file in the pwd </li></ul>
<li> help </li>
<ul><li> show a list of available commands </li></ul>
 	
 <h2> How to run: </h2>
    - Install Golang on your computer
    - And on your terminal go to the directory that has the go application and type: go run main.go 