package main
import ("os"
	"bufio"
	"fmt"
	"io/ioutil"
	"strings"
	"path/filepath"
)


// Terminal contains
type Terminal struct {
	
}

// Execute executes a given command
func (t *Terminal) Execute(command string) {
	
}

func directory_list(dir string){
	files, err := ioutil.ReadDir(dir)
	if err != nil{
		fmt.Println(err)
	}
	for _, file := range files {
		fmt.Println(file.Name(), file.IsDir(), file.Size)
	}
}

func command_list(){
	var list = map[string]string{"exit" : "exit the program",
	"cd" : "change directory to a specified path",
	"ls" : "list items and files in the current path",
	"mkdir [path]" : "create a directory with the specified path",
	"rm [path]" : "remove a specified file or folder",
	"create [path]" : "create a file with a specified name",
	"cat [file]" : "show the contents of a specified file",
	"help": "show a list of available commands",}
	for key,description := range list{
		fmt.Println(key, ":", description)
	}
}

func changedir(rootdir string,newdir string) string{
	newpath := filepath.Join(rootdir,newdir)
	_, err := os.Stat(newpath)
	if err!= nil{
		fmt.Println("Error: the directory does not exist")
	} else {
		return newpath
	}
	return rootdir
}

func makedir(rootdir string, newdir string){
	newpath := filepath.Join(rootdir,newdir)
	err := os.Mkdir(newpath, 0777)
	if err != nil {
		fmt.Println(err)
	}
}

func delete(rootdir string , dir_name string){
	newpath := filepath.Join(rootdir,dir_name)
	_, err := os.Stat(newpath)
	if err != nil {
		fmt.Println(err)
	}
	errr := os.Remove(newpath)
	if errr != nil {
		fmt.Println(errr)
	}	
}

func makefile(rootdir string, filename string){
	newpath := filepath.Join(rootdir,filename)
	file, err := os.Create(newpath)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer file.Close()
}

func printfile(rootdir string, filename string){
	newpath:= filepath.Join(rootdir,filename)
	files,err := os.ReadFile(newpath)
	if err != nil{
		fmt.Println(err)
	}
	fmt.Println(string(files))
}


func main() {
	fmt.Println("\n \n \n \n \n \n  :::::::::::::::: Here's our Command Terminal implemented in GO ::::::::::::::::::::::: \n \n ")
	dir, _ := os.Getwd()
	terminal_reader := bufio.NewReader(os.Stdin)
	
	for true {
		fmt.Print(dir +"> ")
		byte_text,_,_ := terminal_reader.ReadLine() 
		text := string(byte_text[:])
		if text == "exit" {
			break
		} else if text == "ls"{
			directory_list(dir)
		} else if text == "help"{
			command_list()
		} else { 
			command := strings.Split(text, " ")
			if command[0] == "cd"{
				newdir := changedir(dir, command[1])	
				dir = newdir
			} else if command[0] == "mkdir"{
				makedir(dir,command[1])
			} else if command[0] == "rm" { 
				delete(dir,command[1])
			} else if command[0] == "create"{
				makefile(dir, command[1])
			} else if command[0] == "cat"{
				printfile(dir, command[1])
			} else {
				fmt.Println("Invalid command")
			}

		}

	}
}