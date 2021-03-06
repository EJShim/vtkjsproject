import K_Manager from 'K_Manager.js'
import macro from 'vtk.js/Sources/macro';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';
import vtkPiecewiseGaussianWidget from 'vtk.js/Sources/Interaction/Widgets/PiecewiseGaussianWidget';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries'
import {ResizeSensor}     from 'css-element-queries'


import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';

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
        this.sliceMapper = null;
        this.sliceActor = null;



        this.ctf = null;
        this.otf = null;
        this.gaussianWidget = null;

    }



    ImportVolume(files){
        console.log("Volume Import Started");
        readImageDICOMFileSeries(null, files).then(({ image, webWorker })=>{            
            webWorker.terminate();                  
            
            console.log(image);

            let imageData = convertItkToVtkImage(image);
            K_Manager.VolumeMgr().SetImageData(imageData);
        }).catch((err)=>{
            console.log(err);
        })
    }

    SetImageData(imageData){       
        
        this.imageData = imageData

        if(this.mapper == null || this.actor == null){
            this.actor = vtkVolume.newInstance();
            this.mapper = vtkVolumeMapper.newInstance();
            this.mapper.setSampleDistance(2.0);
            this.actor.setMapper(this.mapper);

            //Property Set
            // create color and opacity transfer functions
            this.ctf = vtkColorTransferFunction.newInstance();            
            this.otf = vtkPiecewiseFunction.newInstance();

            //Initialize Test Gaussian Widget
            this.gaussianWidget = vtkPiecewiseGaussianWidget.newInstance({
                numberOfBins: 256,                
            });
            this.gaussianContainer = document.querySelector('#subViewr1');
            this.gaussianWidget.setContainer(this.gaussianContainer);
            new ResizeSensor(this.gaussianContainer, this.ResizeGaussianWidget.bind(this));
            this.ResizeGaussianWidget();

            this.gaussianWidget.updateStyle({
                backgroundColor: 'rgba(0, 0, 0, 0.0)',
                histogramColor: 'rgba(255, 0, 0, 1.0)',
                strokeColor: 'rgb(0, 0, 0)',
                activeColor: 'rgb(255, 255, 255)',
                handleColor: 'rgb(50, 150, 50)',
                buttonDisableFillColor: 'rgba(255, 255, 255, 0.5)',
                buttonDisableStrokeColor: 'rgba(0, 0, 0, 0.5)',
                buttonStrokeColor: 'rgba(0, 0, 0, 1)',
                buttonFillColor: 'rgba(255, 255, 255, 1)',
                strokeWidth: 2,
                activeStrokeWidth: 3,
                buttonStrokeWidth: 1.5,
                handleWidth: 3,
                iconSize: 20, // Can be 0 if you want to remove buttons (dblClick for (+) / rightClick for (-))
                padding: 10,
            });

            this.gaussianWidget.setDataArray(imageData.getPointData().getScalars().getData());
            this.gaussianWidget.applyOpacity(this.otf);
            this.gaussianWidget.setColorTransferFunction(this.ctf);            

            this.gaussianWidget.onAnimation((start) => {
                if (start) {
                    K_Manager.Mgr().renderWindow.getInteractor().requestAnimation(this.gaussianWidget);
                } else {
                    K_Manager.Mgr().renderWindow.getInteractor().cancelAnimation(this.gaussianWidget);
                }
            });
              
            this.gaussianWidget.onOpacityChange(() => {
                this.gaussianWidget.applyOpacity(this.otf);
                if (!K_Manager.Mgr().renderWindow.getInteractor().isAnimating()) {
                    K_Manager.Mgr().renderWindow.render();
                }
            });

            
            this.gaussianWidget.addGaussian(0.75, 1, 0.3, 0, 0);            
            this.gaussianWidget.bindMouseListeners();

            this.actor.getProperty().setRGBTransferFunction(0, this.ctf);
            this.actor.getProperty().setScalarOpacity(0, this.otf);
            this.actor.getProperty().setScalarOpacityUnitDistance(0, 4.5);
            this.actor.getProperty().setInterpolationTypeToFastLinear();

            //from here, idunno what exactly they are doing
            // this.actor.getProperty().setUseGradientOpacity(0, true);
            // this.actor.getProperty().setGradientOpacityMinimumValue(0, 15);
            // this.actor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
            // this.actor.getProperty().setGradientOpacityMaximumValue(0, 100);
            // this.actor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);


            K_Manager.Mgr().AddActor(this.actor);


            //Add Slice Image
            this.sliceMapper = vtkImageMapper.newInstance();
            this.sliceMapper.setInputData(imageData);
            this.sliceMapper.setKSlice(30);
            this.sliceActor = vtkImageSlice.newInstance();
            this.sliceActor.setMapper(this.sliceMapper);

            K_Manager.Mgr().AddSliceActor(this.sliceActor);
            K_Manager.Mgr().AddActor(this.sliceActor);

            //Initialize CTF Ctonol
            this.InitializeCTFContoller();
        }

        //const scalarRange = imageData.getPointData().getScalars().getRange();
        this.mapper.setInputData(imageData);

 

        this.SetPresetCTF(0);

        K_Manager.Mgr().Redraw();
    }

    ResizeGaussianWidget(){        

        const dims = this.gaussianContainer.getBoundingClientRect();
        
        this.gaussianWidget.setSize(
          Math.floor(dims.width),
          Math.floor(dims.height)
        );

        this.gaussianWidget.render();
    }

    SetPresetCTF(idx){

        const scalarRange = this.imageData.getPointData().getScalars().getRange();
        

        this.ctf.removeAllPoints();
        
        switch(idx){
            case 0:
                this.ctf.addRGBPoint(scalarRange[0], 1.0, 1.0, 1.0);
                this.ctf.addRGBPoint(scalarRange[1], 1.0, 1.0, 1.0);
                this.actor.getProperty().setShade(false);
            break;
            case 1:
                this.ctf.addRGBPoint(scalarRange[0], 0.0, 0.0, 0.0);
                this.ctf.addRGBPoint(-16, 0.73, 0.25, 0.30);                
                this.ctf.addRGBPoint(641, 0.90, 0.82, 0.56);
                this.ctf.addRGBPoint(scalarRange[1], 1.0, 1.0, 1.0);
                this.actor.getProperty().setShade(true);
                this.actor.getProperty().setAmbient(0.2);
                this.actor.getProperty().setDiffuse(0.7);
                this.actor.getProperty().setSpecular(0.3);
                this.actor.getProperty().setSpecularPower(8.0);
            break;
            default:
            break;
        }
        
        //Redraw
        this.gaussianWidget.render();
        K_Manager.Mgr().Redraw();
    }

    InitializeCTFContoller(){
        const controller = document.querySelector('#ctfController'); 
        controller.addEventListener("change", ()=>{            
            this.SetPresetCTF(controller.selectedIndex);
        })
    }
}


export default K_VolumeManager