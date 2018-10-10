import vtkGenericRenderWindow from 'vtk.js/Sources/Rendering/Misc/GenericRenderWindow'
import vtkActor           from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper          from 'vtk.js/Sources/Rendering/Core/Mapper';
import {ResizeSensor}     from 'css-element-queries';


import vtkConeSource      from 'vtk.js/Sources/Filters/Sources/ConeSource';
import vtkCubeSource      from 'vtk.js/Sources/Filters/Sources/CubeSource';
import vtkCylinderSource      from 'vtk.js/Sources/Filters/Sources/CylinderSource';

//Mesh Manager
import K_MeshManager from 'K_MeshManager.js'


// 가장 root 가 되는 manager, static method 로 동작하여서 어디서든 정보에 접근 및 수정할 수 있게 되어있음
class K_Manager {

    static New(){
        //Instances
        this.meshManager = null;
        
        this.renderWindow = null;
        this.renderer = null;

        //Rendering Pipeline
        this.mapper = null;
        this.actor = null;

        this._Initialize();

    }

    //private methods
    static _Initialize(){
        //First, Initialize Renderer
        const container = document.querySelector('#mainViewer');
        const genericRenderWindow = vtkGenericRenderWindow.newInstance();

        // VTK renderWindow/renderer
        this.renderWindow = genericRenderWindow.getRenderWindow();
        this.renderer = genericRenderWindow.getRenderer();
        genericRenderWindow.setContainer(container);

        //not properly working on microsoft edge,, there is no standard for handling resize event
        new ResizeSensor(container, genericRenderWindow.resize);
        this.renderer.setBackground(0.4, 0.1, 0.1);


        // ----------------------------------------------------------------------------
        // Example code
        // ----------------------------------------------------------------------------        
        const coneSource = vtkConeSource.newInstance({ height: 1.0 });

        this.mapper = vtkMapper.newInstance();
        this.mapper.setInputConnection(coneSource.getOutputPort());

        this.actor = vtkActor.newInstance();
        this.actor.setMapper(this.mapper);

        this.renderer.addActor(this.actor);        
        genericRenderWindow.resize();
    }


    //public method
    static MeshMgr(){
        if(this.meshManager == null){
            this.meshManager = new K_MeshManager();
        }
        return this.meshManager;
    }

    static Redraw(){
        this.renderer.resetCamera();
        this.renderWindow.render();
    }

    static Test(){
        //show random source
        const sources = [vtkConeSource, vtkCubeSource, vtkCylinderSource];
        const idx = Math.floor(Math.random() * (2 - 0 + 1));
        const source = sources[idx].newInstance();
        this.mapper.setInputConnection(source.getOutputPort());
        
        this.Redraw();
        
    }

}

export default K_Manager