import K_Manager from 'K_Manager.js'

class K_MeshManager{
    constructor(){
        
    }

    ImportMesh(file){
        console.log(file);

        //create file path
        file_path = URL.createObjectURL(file);
        console.log(file_path);
    }
}

export default K_MeshManager;