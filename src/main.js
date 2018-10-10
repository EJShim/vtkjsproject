import K_Manager from 'K_Manager.js'

//Initialize Manager
K_Manager.New();
K_Manager.Redraw();


///Add Button Event .bind() function 을 넣어야지 함수 안에서 class instance 및 method 사용가능
document.querySelector('#button_importMesh').addEventListener("click", K_Manager.MeshMgr().ImportMesh.bind(K_Manager.MeshMgr()));
document.querySelector('#button_test').addEventListener("click", K_Manager.Test.bind(K_Manager));