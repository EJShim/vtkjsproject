import K_Manager from 'K_Manager.js'
import vtkSTLReader from 'vtk.js/Sources/IO/Geometry/STLReader';
import vtkActor           from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper          from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkConeSource      from 'vtk.js/Sources/Filters/Sources/ConeSource';
import vtkCubeSource      from 'vtk.js/Sources/Filters/Sources/CubeSource';
import vtkCylinderSource      from 'vtk.js/Sources/Filters/Sources/CylinderSource';
import vtkArrowSource from 'vtk.js/Sources/Filters/Sources/ArrowSource';


class K_MeshManager{
    constructor(){

        //Rendering Pipeline
        this.mapper = null;
        this.actor = null;
        
        this._Initialize();
    }

    _Initialize(){
         // ----------------------------------------------------------------------------
        // Example code
        // ----------------------------------------------------------------------------        
        const coneSource = vtkConeSource.newInstance({ height: 1.0 });

        this.mapper = vtkMapper.newInstance();
        this.mapper.setInputConnection(coneSource.getOutputPort());

        this.actor = vtkActor.newInstance();
        this.actor.setMapper(this.mapper);

        K_Manager.AddActor(this.actor);
        K_Manager.Redraw();
    }

    ImportMesh(file){
        console.log(file);

        //create file path
        const file_path = URL.createObjectURL(file);
        console.log(file_path);

        const reader = vtkSTLReader.newInstance();
        reader.setUrl(file_path);

        
        this.mapper.setInputData(reader.getOutput());
        
    }

    Test(){
        //show random source
        const sources = [vtkConeSource, vtkCubeSource, vtkCylinderSource, vtkArrowSource];
        const idx = Math.floor(Math.random() * 4);
        const source = sources[idx].newInstance();
        this.mapper.setInputConnection(source.getOutputPort());
        this.actor.getProperty().setColor(Math.random(), Math.random(), Math.random());        
        
    }
}

export default K_MeshManager;