<!--А теперь предлагаю немного понизить градус и снова вернуться к истокам. Допустим, мы знаем, что бывают фабрики, производящие какой-то свой продукт. Нам не важно, как именно фабрика делает этот продукт, но мы знаем, что у любой фабрики есть один универсальный способ попросить его:-->
<?php
/**
 * Фабрика
 */
interface Factory
{

    /**
     * Возвращает продукт
     *
     * @return Product
     */
    public function getProduct();
}

/**
 * Продукт
 */
interface Product
{

    /**
     * Возвращает название продукта
     *
     * @return string
     */
    public function getName();
}

/**
 * Первая фабрика
 */
class FirstFactory implements Factory
{

    /**
     * Возвращает продукт
     *
     * @return Product
     */
    public function getProduct()
    {
        return new FirstProduct();
    }
}

/**
 * Вторая фабрика
 */
class SecondFactory implements Factory
{

    /**
     * Возвращает продукт
     *
     * @return Product
     */
    public function getProduct()
    {
        return new SecondProduct();
    }
}

/**
 * Первый продукт
 */
class FirstProduct implements Product
{

    /**
     * Возвращает название продукта
     *
     * @return string
     */
    public function getName()
    {
        return 'The first product';
    }
}

/**
 * Второй продукт
 */
class SecondProduct implements Product
{

    /**
     * Возвращает название продукта
     *
     * @return string
     */
    public function getName()
    {
        return 'Second product';
    }
}

/*
 * =====================================
 *        USING OF FACTORY METHOD
 * =====================================
 */

$factory = new FirstFactory();
$firstProduct = $factory->getProduct();
$factory = new SecondFactory();
$secondProduct = $factory->getProduct();

print_r($firstProduct->getName());
// The first product
print_r($secondProduct->getName());
// Second product

//В данном примере метод getProduct() является фабричным.