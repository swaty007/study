<!--Возможно, кому-то захочется использовать множество различных синглтонов в своём проекте. Тогда, наверное, стоит отделить логику шаблона от конкретной реализации. Давайте попробуем скрестить шаблоны «Одиночка» и «Пул объектов»:-->
<?php
/**
 * Общий интерфейс пула одиночек
 */
abstract class FactoryAbstract
{

    /**
     * @var array
     */
    protected static $instances = array();


    /**
     * Возвращает экземпляр класса, из которого вызван
     *
     * @return static
     */
    public static function getInstance()
    {
        $className = static::getClassName();
        if (!(self::$instances[$className] instanceof $className)) {
            self::$instances[$className] = new $className();
        }
        return self::$instances[$className];
    }

    /**
     * Удаляет экземпляр класса, из которого вызван
     *
     * @return void
     */
    public static function removeInstance()
    {
        $className = static::getClassName();
        if (array_key_exists($className, self::$instances)) {
            unset(self::$instances[$className]);
        }
    }

    /**
     * Возвращает имя экземпляра класса
     *
     * @return string
     */
    final protected static function getClassName()
    {
        return get_called_class();
    }

    /**
     * Конструктор закрыт
     */
    protected function __construct()
    {
    }

    /**
     * Клонирование запрещено
     */
    final protected function __clone()
    {
    }

    /**
     * Сериализация запрещена
     */
    final protected function __sleep()
    {
    }

    /**
     * Десериализация запрещена
     */
    final protected function __wakeup()
    {
    }
}

/**
 * Интерфейс пула одиночек
 */
abstract class Factory extends FactoryAbstract
{

    /**
     * Возвращает экземпляр класса, из которого вызван
     *
     * @return static
     */
    final public static function getInstance()
    {
        return parent::getInstance();
    }

    /**
     * Удаляет экземпляр класса, из которого вызван
     *
     * @return void
     */
    final public static function removeInstance()
    {
        parent::removeInstance();
    }
}

/*
 * =====================================
 *           USING OF MULTITON
 * =====================================
 */

/**
 * Первый одиночка
 */
class FirstProduct extends Factory
{
    public $a = [];
}

/**
 * Второй одиночка
 */
class SecondProduct extends FirstProduct
{
}

// Заполняем свойства одиночек
FirstProduct::getInstance()->a[] = 1;
SecondProduct::getInstance()->a[] = 2;
FirstProduct::getInstance()->a[] = 3;
SecondProduct::getInstance()->a[] = 4;

print_r(FirstProduct::getInstance()->a);
// array(1, 3)
print_r(SecondProduct::getInstance()->a);
// array(2, 4)

//Итак, для добавления нового класса-одиночки нам просто нужно унаследовать его от класса Factory. В примере мы создали два таких класса и проверили, что у каждого из этих классов свой единственный экземпляр.

//Я не случайно разбил общую логику на два абстрактных класса. Теперь давайте ещё немного усложним пример. Позволим создавать несколько одиночек для каждого класса, отличающихся уникальным идентификатором.


/**
 * Интерфейс сложного пула одиночек
 */
abstract class RegistryFactory extends FactoryAbstract
{

    /**
     * Возвращает экземпляр класса, из которого вызван
     *
     * @param integer|string $id - уникальный идентификатор одиночки
     * @return static
     */
    final public static function getInstance($id)
    {
        $className = static::getClassName();
        if (isset(self::$instances[$className])) {
            if (!(self::$instances[$className][$id] instanceof $className)) {
                self::$instances[$className][$id] = new $className($id);
            }
        } else {
            self::$instances[$className] = [
                $id => new $className($id),
            ];
        }
        return self::$instances[$className][$id];
    }

    /**
     * Удаляет экземпляр класса, из которого вызван
     *
     * @param integer|string $id - уникальный идентификатор одиночки. Если не указан, все экземпляры класса будут удалены
     * @return void
     */
    final public static function removeInstance($id = null)
    {
        $className = static::getClassName();
        if (isset(self::$instances[$className])) {
            if (is_null($id)) {
                unset(self::$instances[$className]);
            } else {
                if (isset(self::$instances[$className][$id])) {
                    unset(self::$instances[$className][$id]);
                }
                if (empty(self::$instances[$className])) {
                    unset(self::$instances[$className]);
                }
            }
        }
    }

    protected function __construct($id)
    {
    }
}

/*
 * =====================================
 *           USING OF MULTITON
 * =====================================
 */

/**
 * Первый пул одиночек
 */
class FirstFactory extends RegistryFactory
{
    public $a = [];
}

/**
 * Второй пул одиночек
 */
class SecondFactory extends FirstFactory
{
}

// Заполняем свойства одиночек
FirstFactory::getInstance('FirstProduct')->a[] = 1;
FirstFactory::getInstance('SecondProduct')->a[] = 2;
SecondFactory::getInstance('FirstProduct')->a[] = 3;
SecondFactory::getInstance('SecondProduct')->a[] = 4;
FirstFactory::getInstance('FirstProduct')->a[] = 5;
FirstFactory::getInstance('SecondProduct')->a[] = 6;
SecondFactory::getInstance('FirstProduct')->a[] = 7;
SecondFactory::getInstance('SecondProduct')->a[] = 8;

print_r(FirstFactory::getInstance('FirstProduct')->a);
// array(1, 5)
print_r(FirstFactory::getInstance('SecondProduct')->a);
// array(2, 6)
print_r(SecondFactory::getInstance('FirstProduct')->a);
// array(3, 7)
print_r(SecondFactory::getInstance('SecondProduct')->a);
// array(4, 8)

//Примерно по такому принципу работают некоторые ORM, позволяя хранить уже загруженные и инициализированные модели.

//А теперь, пока ещё не слишком поздно, верну мечтателей с небес на землю. Шаблон Одиночка и его продвинутые братья, несомненно, могут быть полезны, но не надо забываться и лепить его где нужно и где не нужно. Напомню (или поведаю), что есть такой антипаттерн, «Одиночество» (Singletonitis), который как раз заключается в неуместном использовании синглтонов. Так для чего же нам этот шаблон? Самый распространённый пример – соединение с базой данных, которое создаётся один раз и используется на протяжении работы скрипта. А ещё во многих фреймворках реестр делают одиночкой и используют его, как объект, а не как класс со статическими методами.