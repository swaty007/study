<!--Хотелось бы начать с этого шаблона. Он немного выбивается из общего ряда, потому что не является порождающим, но в дальнейшем нам потребуется его знание. Итак, реестр – это хэш, доступ к данным у которого осуществляется через статические методы:-->
<?php
/**
 * Реестр
 */
class Product
{

    /**
     * @var mixed[]
     */
    protected static $data = array();


    /**
     * Добавляет значение в реестр
     *
     * @param string $key
     * @param mixed $value
     * @return void
     */
    public static function set($key, $value)
    {
        self::$data[$key] = $value;
    }

    /**
     * Возвращает значение из реестра по ключу
     *
     * @param string $key
     * @return mixed
     */
    public static function get($key)
    {
        return isset(self::$data[$key]) ? self::$data[$key] : null;
    }

    /**
     * Удаляет значение из реестра по ключу
     *
     * @param string $key
     * @return void
     */
    final public static function removeProduct($key)
    {
        if (array_key_exists($key, self::$data)) {
            unset(self::$data[$key]);
        }
    }
}

/*
 * =====================================
 *           USING OF REGISTRY
 * =====================================
 */

Product::set('name', 'First product');

print_r(Product::get('name'));
// First product
//Нередко можно встретить реестры, реализующие интерфейсы ArrayAccess и/или Iterator, но на мой взгляд, это лишнее. Основное применение реестра – в качестве безопасной замены глобальным переменным.
