# vtkjsproject
vtk.js project

할일 : 

- vtkrenderer 가 height resizing 에 대응하지 못하는 점 수정 (완료)
- mesh import (완료, 약간 버그가 있음)
- dicom import (완료, volume 다루는 function 알아보기)
    - itk.js  에서는 itk 처럼 여러 dicom series 가 포함된 파일들을 핸들링하지 못함..
    - update 를 기다리는것이 좋을듯
    - ami.js 를 사용하면 three.js 도 불러와야 하고, 불필요한 모듈들이 많이 딸려오기때문에 좋은 방법은 아닌듯함
    - dicom-parser 라는 라이브러리가 있지만, 수작업으로 처리해야할 일이 너무 많음.. series 를 나누는 등의 작업을 구현하였을 때 비효율적일듯.
        정 필요하면 현재로써는 dicom parser 를 써서 구현하는것이 좋긴함 
