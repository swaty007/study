<!--Бывает ситуация, когда у нас есть несколько однотипных фабрик и мы хотим инкапсулировать логику выбора, какую из фабрик использовать для той или иной задачи. Тут-то нам на помощь и приходит этот шаблон.-->
<?php
/**
 * Какой-нибудь файл конфигурации
 */
class Config
{
    public static $factory = 1;
}

/**
 * Какой-то продукт
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
 * Абстрактная фабрика
 */
abstract class AbstractFactory
{

    /**
     * Возвращает фабрику
     *
     * @return AbstractFactory - дочерний объект
     * @throws Exception
     */
    public static function getFactory()
    {
        switch (Config::$factory) {
            case 1:
                return new FirstFactory();
            case 2:
                return new SecondFactory();
        }
        throw new Exception('Bad config');
    }

    /**
     * Возвращает продукт
     *
     * @return Product
     */
    abstract public function getProduct();
}

/*
 * =====================================
 *             FIRST FAMILY
 * =====================================
 */

class FirstFactory extends AbstractFactory
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
 * Продукт первой фабрики
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
        return 'The product from the first factory';
    }
}

/*
 * =====================================
 *             SECOND FAMILY
 * =====================================
 */

class SecondFactory extends AbstractFactory
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
 * Продукт второй фабрики
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
        return 'The product from second factory';
    }
}

/*
 * =====================================
 *       USING OF ABSTRACT FACTORY
 * =====================================
 */

$firstProduct = AbstractFactory::getFactory()->getProduct();
Config::$factory = 2;
$secondProduct = AbstractFactory::getFactory()->getProduct();

print_r($firstProduct->getName());
// The first product from the first factory
print_r($secondProduct->getName());
// Second product from second factory

//Как видно из примера, нам не приходится заботится о том, какую фабрику взять. Абстрактная фабрика сама проверяет настройки конфигурации и возвращает подходящую фабрику. Разумеется, вовсе не обязательно абстрактная фабрика должна руководствоваться файлу конфигурации. Логика выбора может быть любой.