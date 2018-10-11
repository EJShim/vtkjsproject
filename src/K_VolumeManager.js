import K_Manager from 'K_Manager.js'
import macro from 'vtk.js/Sources/macro';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';
// import vtkPiecewiseGaussianWidget from 'vtk.js/Sources/Interaction/Widgets/PiecewiseGaussianWidget';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries'


import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';

const { vtkErrorMacro } = macro;



function convertItkToVtkImage(itkImage, options = {}) {
    // Make sure we can handle input pixel type
    // Refer to itk-js/src/PixelTypes.js for numerical values
    switch (itkImage.imageType.pixelType) {
      case 1: // Scalar
      case 2: // RGB
      case 3: // RGBA
        break;
      default:
        vtkErrorMacro(
          `Cannot handle ITK.js pixel type ${itkImage.imageType.pixelType}`
        );
        return null;
    }
  
    const vtkImage = {
      origin: [0, 0, 0],
      spacing: [1, 1, 1],
    };
  
    const dimensions = [1, 1, 1];
    const direction = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  
    for (let idx = 0; idx < itkImage.imageType.dimension; ++idx) {
      vtkImage.origin[idx] = itkImage.origin[idx];
      vtkImage.spacing[idx] = itkImage.spacing[idx];
      dimensions[idx] = itkImage.size[idx];
      for (let col = 0; col < itkImage.imageType.dimension; ++col) {
        // ITK (and VTKMath) use a row-major index axis, but the direction
        // matrix on the vtkImageData is a webGL matrix, which uses a
        // column-major data layout. Transpose the direction matrix from
        // itkImage when instantiating that vtkImageData direction matrix.
        direction[col + idx * 3] =
          itkImage.direction.data[idx + col * itkImage.imageType.dimension];
      }
    }
  
    // Create VTK Image Data
    const imageData = vtkImageData.newInstance(vtkImage);
  
    // create VTK image data
    const scalars = vtkDataArray.newInstance({
      name: options.scalarArrayName || 'Scalars',
      values: itkImage.data,
      numberOfComponents: itkImage.imageType.components,
    });
  
    imageData.setDirection(direction);
    imageData.setDimensions(...dimensions);
    imageData.getPointData().setScalars(scalars);
  
    return imageData;
}

class K_VolumeManager{
    constructor(){
        this.imageData = null;
        this.mapper = null;
        this.actor = null;

        this.ctf = null;
        this.otf = null;

    }

    ImportVolume(files){
        console.log(files[0]);
        readImageDICOMFileSeries(null, files).then(function ({ image, webWorker }){
            webWorker.terminate()                    

            let imageData = convertItkToVtkImage(image);
            K_Manager.VolumeMgr().SetImageData(imageData);
            
        })
    }

    SetImageData(imageData){        

        if(this.mapper == null || this.actor == null){
            this.actor = vtkVolume.newInstance();
            this.mapper = vtkVolumeMapper.newInstance();
            this.mapper.setSampleDistance(2.0);
            this.actor.setMapper(this.mapper);

            //Property Set
            // create color and opacity transfer functions
            this.ctf = vtkColorTransferFunction.newInstance();            
            this.otf = vtkPiecewiseFunction.newInstance();            

            this.actor.getProperty().setRGBTransferFunction(0, this.ctf);
            this.actor.getProperty().setScalarOpacity(0, this.otf);
            this.actor.getProperty().setScalarOpacityUnitDistance(0, 4.5);
            this.actor.getProperty().setInterpolationTypeToLinear();

            //from here, idunno what exactly they are doing
            this.actor.getProperty().setUseGradientOpacity(0, true);
            this.actor.getProperty().setGradientOpacityMinimumValue(0, 15);
            this.actor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
            this.actor.getProperty().setGradientOpacityMaximumValue(0, 100);
            this.actor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);

            K_Manager.AddVolume(this.actor);
        }

        const scalarRange = imageData.getPointData().getScalars().getRange();
        this.mapper.setInputData(imageData);

        this.ctf.removeAllPoints();
        this.ctf.addRGBPoint(scalarRange[0], 1.0, 1.0, 1.0);
        this.ctf.addRGBPoint(scalarRange[1], 1.0, 1.0, 1.0);
        this.otf.removeAllPoints();
        this.otf.addPoint(scalarRange[0], 0.0);
        this.otf.addPoint(scalarRange[1], 0.1);

        

        K_Manager.Redraw();
        

    }
}


export default K_VolumeManager