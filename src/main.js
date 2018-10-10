import vtkGenericRenderWindow from 'vtk.js/Sources/Rendering/Misc/GenericRenderWindow'
import vtkActor           from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkConeSource      from 'vtk.js/Sources/Filters/Sources/ConeSource';
import vtkMapper          from 'vtk.js/Sources/Rendering/Core/Mapper';
import {ResizeSensor}     from 'css-element-queries';

import K_Manager from 'K_Manager.js'
import K_MeshManager from 'K_MeshManager.js'

const container = document.querySelector('#mainViewer');
const genericRenderWindow = vtkGenericRenderWindow.newInstance();

// VTK renderWindow/renderer
const renderWindow = genericRenderWindow.getRenderWindow();
const renderer = genericRenderWindow.getRenderer();
genericRenderWindow.setContainer(container);

//not properly working on microsoft edge,, there is no standard for handling resize event
new ResizeSensor(container, genericRenderWindow.resize);
renderer.setBackground(0.4, 0.1, 0.1);

// ----------------------------------------------------------------------------
// Example code
// ----------------------------------------------------------------------------

const coneSource = vtkConeSource.newInstance({ height: 1.0 });

const mapper = vtkMapper.newInstance();
mapper.setInputConnection(coneSource.getOutputPort());

const actor = vtkActor.newInstance();
actor.setMapper(mapper);

renderer.addActor(actor);
renderer.resetCamera();
genericRenderWindow.resize();
renderWindow.render();




///Test Static Functions
K_Manager.someMethod();
K_Manager.anotherMethod();
K_MeshManager.tryStatic();
