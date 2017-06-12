class A {
  constructor(a) {
    console.log(a);

  }
}

class B extends A {
  constructor(b){
    super(b);
    console.log(b);
  }

}
