<!--Некоторые объекты приходится создавать многократно. Есть смысл сэкономить на их инициализации, особенно, если инициализация требует времени и ресурсов. Прототип – это заранее инициализированный и сохранённый объект. В случае необходимости он клонируется:-->
<?php
/**
 * Какой-то продукт
 */
interface Product
{
}

/**
 * Какая-то фабрика
 */
class Factory
{

    /**
     * @var Product
     */
    private $product;


    /**
     * @param Product $product
     */
    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    /**
     * Возвращает новый продукт путём клонирования
     *
     * @return Product
     */
    public function getProduct()
    {
        return clone $this->product;
    }
}

/**
 * Продукт
 */
class SomeProduct implements Product
{
    public $name;
}

/*
 * =====================================
 *          USING OF PROTOTYPE
 * =====================================
 */

$prototypeFactory = new Factory(new SomeProduct());

$firstProduct = $prototypeFactory->getProduct();
$firstProduct->name = 'The first product';

$secondProduct = $prototypeFactory->getProduct();
$secondProduct->name = 'Second product';

print_r($firstProduct->name);
// The first product
print_r($secondProduct->name);
// Second product

//Как видно из примера мы создали два никак не связанных объекта.
