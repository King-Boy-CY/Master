
interface funTest {
    a?: boolean,
    isStatus: boolean,
    c?: boolean,
    err?: string,
    getCity?: Function,
}
interface GenericIdentityFn {
    <T>(value:T):T
}
interface attstr {
    length:number
}
/*
protected: 只有在派生类(继承)对象 使用 , 而不能直接引用 
private: 私有属性, 只有在当前类下可用, 继承也无法访问
public: 公有属性, 任何情况下都可使用
super : 继承对象下必须使用, 相当于继承对象下的(this), 访问继承对象都必须使用
*/
class Greeter {
    greeting: string;
    static str:string = 'str'
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

class Animal {
    readonly name: string;
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    public constructor(name: string) { super(name); }
    public move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}
class byName {
    private _fullName:string = '';
    get fullName () :string {
        return this._fullName
    }
    
    set fullName(newFullName : string) {
        console.log('set',newFullName);
        this._fullName = newFullName;
    }
    
}
class classTest {
    p = 10;
    c: boolean;
    city: string
    constructor(isStatus: boolean, city: string) {
        this.c = isStatus
        this.city = city
    }
    m(value: funTest): funTest {
        console.log(this);
        if (value.isStatus) {
            return {
                a: this.c,
                isStatus: value.isStatus,
                getCity: () => {
                    return '当前地区' + this.city
                }
            }
        }
        return {
            err: 'err',
            c: this.c,
            isStatus: value.isStatus,
            ...value,
            getCity: () => {
                return '抱歉没有权限' + 'id:' + new Date().getTime()
            }
        }
    }
}
export  {
    classTest,
    funTest,
    Snake,
    Animal,
    byName,
    Greeter,
    GenericIdentityFn,
    attstr
}