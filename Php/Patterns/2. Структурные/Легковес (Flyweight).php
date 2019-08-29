<?php

namespace RefactoringGuru\Flyweight\Conceptual;


//Применимость: Весь смысл использования Легковеса — в экономии памяти. Поэтому, если в приложении нет такой проблемы, то вы вряд ли найдёте там примеры Легковеса.

//Паттерн особенно редко актуален для PHP-приложений, из-за самой природы языка. Скрипты почти всегда работают с данными приложения частями, никогда не загружая все данные в память одновременно.

//Признаки применения паттерна: Легковес можно определить по создающим методам класса, которые возвращают закешированные объекты, вместо создания новых.

//Этот пример показывает структуру паттерна Легковес, а именно — из каких классов он состоит, какие роли эти классы выполняют и как они взаимодействуют друг с другом. После ознакомления со структурой, вам будет легче воспринимать второй пример, который рассматривает реальный случай использования паттерна в мире PHP.


/**
 * Легковес хранит общую часть состояния (также называемую внутренним
 * состоянием), которая принадлежит нескольким реальным бизнес-объектам.
 * Легковес принимает оставшуюся часть состояния (внешнее состояние, уникальное
 * для каждого объекта)  через его параметры метода.
 */
class Flyweight
{
    private $sharedState;

    public function __construct($sharedState)
    {
        $this->sharedState = $sharedState;
    }

    public function operation($uniqueState): void
    {
        $s = json_encode($this->sharedState);
        $u = json_encode($uniqueState);
        echo "Flyweight: Displaying shared ($s) and unique ($u) state.\n";
    }
}

/**
 * Фабрика Легковесов создает объекты-Легковесы и управляет ими. Она
 * обеспечивает правильное разделение легковесов. Когда клиент запрашивает
 * легковес, фабрика либо возвращает существующий экземпляр, либо создает новый,
 * если он ещё не существует.
 */
class FlyweightFactory
{
    /**
     * @var Flyweight[]
     */
    private $flyweights = [];

    public function __construct(array $initialFlyweights)
    {
        foreach ($initialFlyweights as $state) {
            $this->flyweights[$this->getKey($state)] = new Flyweight($state);
        }
    }

    /**
     * Возвращает хеш строки Легковеса для данного состояния.
     */
    private function getKey(array $state): string
    {
        ksort($state);

        return implode("_", $state);
    }

    /**
     * Возвращает существующий Легковес с заданным состоянием или создает новый.
     */
    public function getFlyweight(array $sharedState): Flyweight
    {
        $key = $this->getKey($sharedState);

        if (!isset($this->flyweights[$key])) {
            echo "FlyweightFactory: Can't find a flyweight, creating new one.\n";
            $this->flyweights[$key] = new Flyweight($sharedState);
        } else {
            echo "FlyweightFactory: Reusing existing flyweight.\n";
        }

        return $this->flyweights[$key];
    }

    public function listFlyweights(): void
    {
        $count = count($this->flyweights);
        echo "\nFlyweightFactory: I have $count flyweights:\n";
        foreach ($this->flyweights as $key => $flyweight) {
            echo $key . "\n";
        }
    }
}

/**
 * Клиентский код обычно создает кучу предварительно заполненных легковесов на
 * этапе инициализации приложения.
 */
$factory = new FlyweightFactory([
    ["Chevrolet", "Camaro2018", "pink"],
    ["Mercedes Benz", "C300", "black"],
    ["Mercedes Benz", "C500", "red"],
    ["BMW", "M5", "red"],
    ["BMW", "X6", "white"],
    // ...
]);
$factory->listFlyweights();

// ...

function addCarToPoliceDatabase(
    FlyweightFactory $ff, $plates, $owner,
    $brand, $model, $color
) {
    echo "\nClient: Adding a car to database.\n";
    $flyweight = $ff->getFlyweight([$brand, $model, $color]);

    // Клиентский код либо сохраняет, либо вычисляет внешнее состояние и
    // передает его методам легковеса.
    $flyweight->operation([$plates, $owner]);
}

addCarToPoliceDatabase($factory,
    "CL234IR",
    "James Doe",
    "BMW",
    "M5",
    "red",
);

addCarToPoliceDatabase($factory,
    "CL234IR",
    "James Doe",
    "BMW",
    "X1",
    "red",
);

$factory->listFlyweights();


//FlyweightFactory: I have 5 flyweights:
//Chevrolet_Camaro2018_pink
//Mercedes Benz_C300_black
//Mercedes Benz_C500_red
//BMW_M5_red
//BMW_X6_white

//Client: Adding a car to database.
//FlyweightFactory: Reusing existing flyweight.
//Flyweight: Displaying shared (["BMW","M5","red"]) and unique (["CL234IR","James Doe"]) state.

//Client: Adding a car to database.
//FlyweightFactory: Can't find a flyweight, creating new one.
//Flyweight: Displaying shared (["BMW","X1","red"]) and unique (["CL234IR","James Doe"]) state.

//FlyweightFactory: I have 6 flyweights:
//Chevrolet_Camaro2018_pink
//Mercedes Benz_C300_black
//Mercedes Benz_C500_red
//BMW_M5_red
//BMW_X6_white
//BMW_X1_red