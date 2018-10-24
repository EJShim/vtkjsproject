import K_Manager from 'K_Manager.js'

//Initialize Manager
// K_Manager.Mgr().Redraw();



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
        K_Manager.MeshMgr().ImportMesh(file);
        K_Manager.Mgr().Redraw();

        //Remove Dialog??
    });
}

function onImportVolume(){

    let fileDialog = document.createElement("input");
    fileDialog.setAttribute("type", "file");
    fileDialog.setAttribute("accept", ".dcm");    
    fileDialog.setAttribute("multiple", true);
    fileDialog.click();    
    fileDialog.addEventListener("change", function(event){                
        //If no file selected
        if(event.target.files.length < 1) {
            console.log("no file selected");
            return;
        }

        //iterate file in this directory
        
        K_Manager.VolumeMgr().ImportVolume(event.target.files);
        K_Manager.Mgr().Redraw();
    });



    
}

function onTest(){
    K_Manager.MeshMgr().Test();
    K_Manager.Mgr().Redraw();
}




///connect button and event listener functions
document.querySelector('#button_importMesh').addEventListener("click", onImportMesh);
document.querySelector('#button_importDicom').addEventListener("click", onImportVolume);
document.querySelector('#button_test').addEventListener("click", onTest);