import K_Manager from 'K_Manager.js'


K_Manager.New();
K_Manager.Redraw();


///Add Button Event
document.querySelector('#button_importMesh').addEventListener("click", K_Manager.MeshMgr().ImportMesh.bind(K_Manager.MeshMgr()));
document.querySelector('#button_test').addEventListener("click", K_Manager.Test.bind(K_Manager));