<?php

//Применимость: Паттерн Заместитель применяется в PHP коде тогда, когда надо заменить настоящий объект его суррогатом, причём незаметно для клиентов настоящего объекта. Это позволит выполнить какие-то добавочные поведения до или после основного поведения настоящего объекта.

//Признаки применения паттерна: Класс заместителя чаще всего делегирует всю настоящую работу своему реальному объекту. Заместители часто сами следят за жизненным циклом своего реального объекта.

//Этот пример показывает структуру паттерна Заместитель, а именно — из каких классов он состоит, какие роли эти классы выполняют и как они взаимодействуют друг с другом. После ознакомления со структурой, вам будет легче воспринимать второй пример, который рассматривает реальный случай использования паттерна в мире PHP.


namespace RefactoringGuru\Proxy\Conceptual;

/**
 * Интерфейс Субъекта объявляет общие операции как для Реального Субъекта, так и
 * для Заместителя. Пока клиент работает с Реальным Субъектом, используя этот
 * интерфейс, вы сможете передать ему заместителя вместо реального субъекта.
 */
interface Subject
{
    public function request(): void;
}

/**
 * Реальный Субъект содержит некоторую базовую бизнес-логику. Как правило,
 * Реальные Субъекты способны выполнять некоторую полезную работу, которая к
 * тому же может быть очень медленной или точной – например, коррекция входных
 * данных. Заместитель может решить эти задачи без каких-либо изменений в коде
 * Реального Субъекта.
 */
class RealSubject implements Subject
{
    public function request(): void
    {
        echo "RealSubject: Handling request.\n";
    }
}

/**
 * Интерфейс Заместителя идентичен интерфейсу Реального Субъекта.
 */
class Proxy implements Subject
{
    /**
     * @var RealSubject
     */
    private $realSubject;

    /**
     * Заместитель хранит ссылку на объект класса РеальныйСубъект. Клиент может
     * либо лениво загрузить его, либо передать Заместителю.
     */
    public function __construct(RealSubject $realSubject)
    {
        $this->realSubject = $realSubject;
    }

    /**
     * Наиболее распространёнными областями применения паттерна Заместитель
     * являются ленивая загрузка, кэширование, контроль доступа, ведение журнала
     * и т.д. Заместитель может выполнить одну из этих задач, а затем, в
     * зависимости от результата, передать выполнение одноимённому методу в
     * связанном объекте класса Реального Субъект.
     */
    public function request(): void
    {
        if ($this->checkAccess()) {
            $this->realSubject->request();
            $this->logAccess();
        }
    }

    private function checkAccess(): bool
    {
        // Некоторые реальные проверки должны проходить здесь.
        echo "Proxy: Checking access prior to firing a real request.\n";

        return true;
    }

    private function logAccess(): void
    {
        echo "Proxy: Logging the time of request.\n";
    }
}

/**
 * Клиентский код должен работать со всеми объектами (как с реальными, так и
 * заместителями) через интерфейс Субъекта, чтобы поддерживать как реальные
 * субъекты, так и заместителей. В реальной жизни, однако, клиенты в основном
 * работают с реальными субъектами напрямую. В этом случае, для более простой
 * реализации паттерна, можно расширить заместителя из класса реального
 * субъекта.
 */
function clientCode(Subject $subject)
{
    // ...

    $subject->request();

    // ...
}

echo "Client: Executing the client code with a real subject:\n";
$realSubject = new RealSubject;
clientCode($realSubject);

echo "\n";

echo "Client: Executing the same client code with a proxy:\n";
$proxy = new Proxy($realSubject);
clientCode($proxy);

//Client: Executing the client code with a real subject:
//RealSubject: Handling request.

//Client: Executing the same client code with a proxy:
//Proxy: Checking access prior to firing a real request.
//RealSubject: Handling request.
//Proxy: Logging the time of request.