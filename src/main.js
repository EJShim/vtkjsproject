import K_Manager from 'K_Manager.js'

//Initialize Manager
K_Manager.New();
K_Manager.Redraw();


//Event Listeners
function onImportMesh(){
    //Create File Dialog
    let fileDialog = document.createElement("input");
    fileDialog.setAttribute("type", "file");
    fileDialog.setAttribute("accept", ".stl");
    //Multiple:True will let dialog be able to select multiple files
    fileDialog.setAttribute("multiple", false);
    fileDialog.click();    

    fileDialog.addEventListener("change", function(event){                
        //If no file selected
        if(event.target.files.length < 1) return;

        //http file element
        const file = event.target.files[0];        
        K_Manager.MeshMgr().ImoprtMesh(file);

        //Remove Dialog??
    });

//   fileDialog.addEventListener("change", function(ev){
//     //console.log(ev.target.files);

//     for(var i=0 ; i<ev.target.files.length ; i++){
//         var path = URL.createObjectURL(ev.target.files[i]);
//         var name = ev.target.files[i].name;

//         //Import Mesh
//         Manager.MeshMgr().ImportMesh(path, name);
//     }

//     //Remove File Dialog Element
//     parent.removeChild(fileDialog);
//   });

}

function onTest(){
    K_Manager.Test();
}




///connect button and event listener functions
document.querySelector('#button_importMesh').addEventListener("click", onImportMesh);
document.querySelector('#button_test').addEventListener("click", onTest);