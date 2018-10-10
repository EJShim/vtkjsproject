class K_Manager {
    
    static someMethod () {
        if(this.number == null){
            this.number = 1;
        }
        
        console.log(this.number);
        this.number += 1;
    }

    static anotherMethod () {
        console.log(this.number);
    }
}

export default K_Manager