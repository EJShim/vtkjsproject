import vtkGenericRenderWindow from 'vtk.js/Sources/Rendering/Misc/GenericRenderWindow'
import vtkInteractorStyleManipulator from 'vtk.js/Sources/Interaction/Style/InteractorStyleManipulator';
// For resize Handling,, vulky
import {ResizeSensor}     from 'css-element-queries'
//Mesh Manager
import K_MeshManager from 'K_MeshManager.js'
import K_VolumeManager from 'K_VolumeManager.js'

// 가장 root 가 되는 manager, static method 로 동작하여서 어디서든 정보에 접근 및 수정할 수 있게 되어있음
class K_Manager {

    static New(){
        //Instances
        this.meshManager = null;
        this.volumeManager = null;
        
        this.renderWindow = null;
        this.renderer = null;

        this.sliceRenderWindow = null;
        this.sliceRenderer = null;

        

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
        this.renderer.setBackground(0.0, 0.05, 0.0);
        genericRenderWindow.setContainer(container);
        //not properly working on microsoft edge,, there is no standard for handling resize event
        new ResizeSensor(container, genericRenderWindow.resize);
        genericRenderWindow.resize();


        const resizeContainer = document.querySelector('#subViewr2');
        const sliceGenericRenderWindow = vtkGenericRenderWindow.newInstance();
        const interactorStyle = vtkInteractorStyleManipulator.newInstance();
        sliceGenericRenderWindow.getInteractor().setInteractorStyle(interactorStyle);
        interactorStyle.removeAllMouseManipulators();

        this.sliceRenderWindow = sliceGenericRenderWindow.getRenderWindow();
        this.sliceRenderer = sliceGenericRenderWindow.getRenderer();
        this.sliceRenderer.setBackground(0.0, 0.0, 0.02);
        this.sliceRenderer.getActiveCamera().setParallelProjection(true);
        sliceGenericRenderWindow.setContainer(resizeContainer);
        new ResizeSensor(resizeContainer, sliceGenericRenderWindow.resize);
        sliceGenericRenderWindow.resize();

        
    }


    //public method
    static MeshMgr(){
        if(this.meshManager == null){
            this.meshManager = new K_MeshManager();
        }
        return this.meshManager;
    }

    static VolumeMgr(){
        if(this.volumeManager == null){
            this.volumeManager = new K_VolumeManager();
        }

        return this.volumeManager;
    }

    static AddActor(actor){
        this.renderer.addActor(actor);
    }

    static AddSliceActor(actor){
        this.sliceRenderer.addActor(actor);
    }

    static Redraw(){
        this.renderer.resetCamera();
        this.renderWindow.render();
        
        this.sliceRenderer.resetCamera();
        this.sliceRenderWindow.render();
    }

}

export default K_Manager