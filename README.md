<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Developer Screening</title>
  <link rel="stylesheet" href="https://stackedit.io/style.css" />
</head>

<body class="stackedit">
  <div class="stackedit__html"><h1 id="developer-screening">Developer Screening</h1>
<blockquote>
<p>Большая ошибка HRов заключается в том, что они нанимают людей, исходя из списка требований. Вместо того, чтобы искать человека с тремя года опыта программирования на С++ и годом на Java, они смотрят на весь список того, что он умеет. А ведь на самом деле, если программист выучил нужный для работы язык всего год назад, но до этого много лет программировал на другом языке, то он идеальный кандидат для этой должности из-за хорошего бекграунда в других областях.</p>
</blockquote>
<h2 id="обзорные-знания-по-специальным-базам">Обзорные знания по специальным базам</h2>
<h3 id="арифметические-основы">1. Арифметические основы</h3>
<ol>
<li>Двоичная система исчисления, операции с двоичными числами.</li>
</ol>
<ul>
<li>
<p>Причины использования двоичной системы исчисления?</p>
</li>
<li>
<p>Какие ты знаешь двоичные операции и что они делают?</p>
</li>
</ul>
<ol start="2">
<li>Перевод числа из десятичной в двоичную систему</li>
</ol>
<ul>
<li>Как можно перевести число 170 в двоичную систему исчисления? Написать пример кода.</li>
</ul>
<p>1.3.</p>
<h3 id="теория-алгоритмов">2. Теория алгоритмов</h3>
<ol>
<li>Алгоритмы сортировки</li>
</ol>
<ul>
<li>Быстрый поиск числа в сортированном массиве?</li>
<li>Какие ты знаешь алгоритмы сортировки данных?</li>
<li>Идея алгоритма quick sort?</li>
<li>Идея алгоритма megre sort?</li>
</ul>
<ol start="2">
<li>Структуры данных</li>
</ol>
<ul>
<li>Как может быть представлен связный список в памяти?</li>
<li>Какие особенности у структуры данных связанный список?</li>
<li>Что такое структура данных стек?</li>
<li>Что такое структура данных очередь?</li>
<li>Что такое структура данных множество?</li>
</ul>
<ol start="3">
<li>Структура данных: дерево</li>
</ol>
<ul>
<li>Опишите структуру данных дерево?</li>
<li>Как может быть представлено дерево в памяти?</li>
<li>Как бы вы реализовывали обход дерева?</li>
<li>Поиск в глубину, в ширину?</li>
</ul>
<ol start="4">
<li>Структура данных: Граф</li>
</ol>
<ul>
<li>Опишите структуру данных Граф</li>
<li>Чем отличается направленный граф от не направленного?</li>
<li>Как бы вы представили граф в памяти</li>
</ul>
<ol start="5">
<li>Сложность алгоритмов</li>
</ol>
<ul>
<li>Что такое алгоритмическая сложность</li>
<li>Какова сложность алгоритма Bubble Sort (добавить листинг)</li>
<li>Какова сложность алгоритма Quick Sort</li>
</ul>
<h3 id="языки-программирования">3. Языки программирования</h3>
<ol>
<li>
<p>Функциональные, процедурные, объектно-ориентированные языки и их отличия</p>
</li>
<li>
<p>Интерпретируемые и компилируемые языки и их отличия</p>
</li>
<li>
<p>Принципы ООП: Абстракция, инкапсуляция, наследование, полиморфизм</p>
</li>
</ol>
<h3 id="введение-в-комбинаторику-и-оптимизацию">4. Введение в комбинаторику и оптимизацию</h3>
<p>4.1. Сколькими способами из колоды в 36 карт можно выбрать 3 карты?</p>
<p>Машина тьюринга</p>
<p>Конечные автоматы</p>
<h1 id="общие-вопросы-для-frontend--backend">Общие вопросы для Frontend &amp; Backend</h1>
<h2 id="javascript">Javascript</h2>
<h3 id="основной-цикл-javascript">Основной цикл Javascript</h3>
<ol>
<li>Каким образом браузер регулирует обработку событий?</li>
<li>В каких случаях события обрабатываются добавляются в очередь а в каких выполняются синхронно?</li>
</ol>
<h5 id="практические-вопросы">Практические вопросы</h5>
<ol>
<li>Последовательность обработки событий. Событие будет обработано синхронно или асинхронно?</li>
</ol>
<pre class=" language-markup"><code class="prism  language-markup"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>button<span class="token punctuation">"</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>button<span class="token punctuation">"</span></span> <span class="token attr-name">value</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>Press me<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span> <span class="token attr-name">size</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>60<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script language-javascript">
  button<span class="token punctuation">.</span><span class="token function-variable function">onclick</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    text<span class="token punctuation">.</span>value <span class="token operator">+=</span> <span class="token string">' Start Click '</span><span class="token punctuation">;</span>
    text<span class="token punctuation">.</span><span class="token function">focus</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    text<span class="token punctuation">.</span>value <span class="token operator">+=</span> <span class="token string">' End Click '</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  text<span class="token punctuation">.</span><span class="token function-variable function">onfocus</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    text<span class="token punctuation">.</span>value <span class="token operator">+=</span> <span class="token string">' Focus '</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre>
<ol start="2">
<li>Что будет выведено в консоль, до/после закрытия <code>alert</code>?</li>
</ol>
<pre class=" language-js"><code class="prism  language-js"><span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
	<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"One"</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span>
	<span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">"Hello"</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">200</span><span class="token punctuation">)</span>
<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"Two"</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span>
<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"Three"</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">300</span><span class="token punctuation">)</span>
</code></pre>
<h3 id="scope-замыкание-или-область-видимости">Scope (Замыкание или Область видимости)</h3>
<ol>
<li>Что такое Scope (область видимости)?</li>
<li>Что такое Scope Chain (цепочка областей видимости)?</li>
<li>В какой момент создается замыкание. В момент декларации функции или в момент ее активации?</li>
</ol>
<h3 id="execution-context">Execution Context</h3>
<ol>
<li>Расскажите, что такое поднятие (hoisting)?</li>
<li>Что вы можете рассказать про <em>Creation phase</em> и <em>Execution phase</em> при создании контекста исполнения?</li>
<li>Объясните разницу при объявлении функций двумя разными способами <code>function foo() {}</code> и <code>var foo = function() {}</code></li>
</ol>
<h5 id="практические-вопросы-1">Практические вопросы</h5>
<ol>
<li>Вопрос на понимание работы hoisting.</li>
</ol>
<pre class=" language-js"><code class="prism  language-js"><span class="token keyword">var</span> foo <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token keyword">function</span> <span class="token function">someFunc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">var</span> foo <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>foo<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Что будет выведено в консоль?</span>
<span class="token punctuation">}</span>
<span class="token function">someFunc</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> 
</code></pre>
<ol start="2">
<li>Уточняющий вопрос на понимание работы hoisting.</li>
</ol>
<pre class=" language-js"><code class="prism  language-js"><span class="token keyword">var</span> foo <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token keyword">function</span> <span class="token function">someFunc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>foo<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Что будет выведено в консоль?</span>
  <span class="token keyword">function</span> <span class="token function">foo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">var</span> foo <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>foo<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Что будет выведено в консоль?</span>
<span class="token punctuation">}</span>
<span class="token function">someFunc</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> 
</code></pre>
<ol start="3">
<li>Вопрос на понимание работы <code>var</code>, <code>let</code>, <code>const</code>.</li>
</ol>
<pre class=" language-js"><code class="prism  language-js"><span class="token keyword">var</span> foo <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> foo <span class="token operator">=</span> i<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>i<span class="token punctuation">,</span> foo<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Что будет выведено в консоль?</span>
</code></pre>
<ol start="4">
<li>Вопрос на знание <code>var</code>, <code>let</code>, <code>const</code>.</li>
</ol>
<pre class=" language-js"><code class="prism  language-js">console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>foo<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Что будет выведено в консоль?</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>bar<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Что будет выведено в консоль?</span>
<span class="token keyword">var</span> foo <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> bar <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>
</code></pre>
<h3 id="this">This</h3>
<ol>
<li>С какой целью может быть написан этот код:<br>
<code>this.handleClick = this.handleClick.bind(this)</code></li>
<li>В чем отличие метода <code>call</code> от <code>apply</code>?</li>
<li>От чего зависит <code>this</code> в контексте исполнения функции?</li>
</ol>
<h4 id="практические-вопросы-2">Практические вопросы</h4>
<ol>
<li>Есть код, который запускается <strong>не</strong> в <em>strict mode</em></li>
</ol>
<pre class=" language-js"><code class="prism  language-js"><span class="token keyword">var</span> foo <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span>
  foo<span class="token punctuation">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
  func<span class="token punctuation">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>foo
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> func2 <span class="token operator">=</span> obj<span class="token punctuation">.</span>func<span class="token punctuation">;</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">func2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre>
<h3 id="протопипы-класcы-и-наследование">Протопипы класcы и наследование</h3>
<ol>
<li>Объясните разницу между:</li>
</ol>
<pre class=" language-js"><code class="prism  language-js"><span class="token keyword">function</span> <span class="token function">Animal</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token keyword">var</span> animal <span class="token operator">=</span> <span class="token function">Animal</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">var</span> animal <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Animal</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre>
<ol start="2">
<li>В чем отличие <strong>proto</strong> от Prototype</li>
<li>Как работает прототипно делигируемое наследование в Javascript</li>
<li>Цепочка прототипов</li>
<li>Функция конструктор</li>
</ol>
<p>TODO: В конструкторе подмеяем this. Придумать практический вопрос на эту тему.</p>
<h3 id="advanced-level-questions">Advanced level questions</h3>
<ol>
<li>Что плохого в использовании <code>eval</code>?</li>
<li>В чем разница между host-объектами и нативными объектами?</li>
<li>В чем опасность использования <code>for .. in</code> для объекта или массива?</li>
<li>В чем разница между <code>null</code> и <code>undefined</code>?</li>
<li>В чем разница между <code>===</code> и <code>==</code>?</li>
<li>Основные принципы работы Garbage Collector в JS.</li>
<li>Знакомы ли вы с <code>propertyDescriptor</code>.</li>
<li>Как работает <code>Object.create</code>.</li>
<li>Процесс разрешение имен идентификаторов. Что такое ReferenceType.</li>
</ol>
<h3 id="es6">ES6</h3>
<ol>
<li>В чём различие между переменными, созданными при помощи <code>let</code>, <code>var</code> и <code>const</code>?</li>
<li>В чём разница между классом в ES6 и функцией-конструктором в ES5?</li>
<li>Что делает метод <code>Function.prototype.bind</code>?</li>
<li>Расскажите, как работает прототипное наследование.</li>
<li>В чем разница между host-объектами и нативными объектами?</li>
<li>Что такое цикл событий (event loop)?</li>
<li>Объясните разницу между изменяемыми (mutable) и неизменяемыми (immutable) объектами.</li>
</ol>
<h3 id="promises-and-generators">Promises and Generators</h3>
<ol>
<li>Что вернет <code>Promise.all</code> если один из промисов завершится ошибкой?</li>
<li>Что возвращает <code>Promise.race</code>?</li>
<li>Что будет если для разрезолвленного промиса вызвать reject?</li>
</ol>
<h5 id="практические-вопросы-3">Практические вопросы</h5>
<ol>
<li>
<p>Напишите функцию <code>delay(ms)</code>, которая возвращает промис, переходящий в состояние <code>"resolved"</code> через <code>ms</code> миллисекунд.</p>
</li>
<li>
<p>Напишите асинхронную рекурсивную функцию <code>factor(n)</code>, которая ищет факториал числа <code>n</code>.</p>
</li>
<li>
<p>Есть итератор <code>fibonacci</code>:</p>
</li>
</ol>
<pre class=" language-js"><code class="prism  language-js"><span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> n <span class="token keyword">of</span> <span class="token function">fibonacci</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// truncate the sequence at 1000</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>n <span class="token operator">&gt;=</span> <span class="token number">1000</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">break</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre>
<p>Напишите генератор <code>fibonacci</code>, который бы генерировал последовательность чисел фибоначи для цикла <code>0 1 1 2 3 5 8 13...</code></p>
<h2 id="browser">Browser</h2>
<ol>
<li>Как браузер рендерит страницу. Фазы рендеринга.</li>
<li>Layouting, Painting, Composing и вопросы по оптимизации браузерного рендеринга.</li>
<li>Какие есть фазы жизненного цикла события?</li>
<li>В чем отличие <code>event.stopPropagation()</code> от <code>event.stopImmediatePropagation()</code>?</li>
<li>Объясните разницу между <code>localStorage</code>, <code>cookies</code> и <code>sessionStorage</code>.</li>
</ol>
<h5 id="практический-вопрос">Практический вопрос</h5>
<p><em>Делегирование событий.</em> Есть список волшебных предметов, задача реализовать подсветку предмета при клике.</p>
<pre class=" language-markup"><code class="prism  language-markup"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>./hand-of-glory.png<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>Hand of Glory<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>./voodoo.png<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>Voodoo doll<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>./adder-stone.png<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>Adder stone<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>./pentacle.png<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>Pentacle<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>./broom.png<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>Broom<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">&gt;</span></span>
</code></pre>
<blockquote>
<p>Эта задача проверка на знания событий и их делегирования, а так-же на знание существования метода элемента <code>closest</code>. Это часто используемый метод, который реализует подход к делегированию событий.</p>
</blockquote>
<ol start="3">
<li>Опишите принципы REST архитектуры?</li>
<li>Опишите концепцию WebHooks?</li>
</ol>
<h3 id="perfermance--debugging">Perfermance &amp; Debugging</h3>
<ol>
<li>Как браузер рендерит страницу. reflow redraw в чем отличия?</li>
<li>Если удалить DOM ноду, будут ли удалены вместе с ней и подписки на события?</li>
</ol>
<h2 id="функциональное-программирование">Функциональное Программирование</h2>
<ol>
<li>Что такое функциональный подход.</li>
<li>Для каких задач и какие библиотеки вы использовали Underscore, Lodash, Lodash/fp, Ramdajs?</li>
<li>В чем отличия <code>_.trottle</code> от <code>_.debounce</code>?</li>
<li>Как работает <code>_.memoize</code>?</li>
<li>Что такое функциональный объект?</li>
<li>Какие задачи решает функциональный подход в программировании.</li>
<li>Какие задачи решает функциональный реактивный подход в программировании.</li>
<li>Functional Reactive Programming. Вопросы по RxJS, Observer, Subject, pipeline. Сравнение с итераторами.</li>
</ol>
<h2 id="базовое-понимание-устройства-сети">Базовое понимание устройства сети</h2>
<p>Опишите весь процесс, начиная с ввода адреса сайта в адресную строку до окончания его загрузки на экране. Или другими словами, что происходит когда в адресной строке браузера мы пытаемся перейти на сайт <a href="http://my.portal.kyiv.ua">my.portal.kyiv.ua</a>.</p>
<h1 id="для-frontend-разработчиков">Для Frontend разработчиков</h1>
<h2 id="web-apis">Web APIs</h2>
<blockquote>
<p>Проверяем обзорные знания по Web APIs с которыми имел опыт работы кандидат.<br>
API достаточно обширное <a href="https://developer.mozilla.org/en-US/docs/Web/API">https://developer.mozilla.org/en-US/docs/Web/API</a>.</p>
</blockquote>
<p>Список APIs которые используются у нас на проекте:</p>
<ul>
<li>Websockets API</li>
<li>Web Workers API</li>
<li>Service Workers API</li>
<li>Shared Workers API</li>
<li>Web Storage API</li>
<li>History API</li>
<li>HTML Drag and Drop API</li>
</ul>
<hr>
<ol>
<li>Имели ли вы опыт работы с <code>&lt;Some API&gt;</code>?</li>
<li>Если да, то для чего вам приходилось его использовать?</li>
</ol>
<h2 id="css">CSS</h2>
<p>Поток, блочные строчные элементы<br>
Семантика HTML5<br>
Приоритезация селекторов<br>
Контекст наложения слоев<br>
Флексы и гриды<br>
Адаптивная верстка<br>
Bootstrap<br>
Что тригерит reflow страницы? height, transform</p>
<h2 id="react">React</h2>
<ul>
<li>В чем преемущества/недостатки <code>React</code> против <code>Native DOM API / jQuery</code>?</li>
<li>За счет чего <code>React</code> быстро обновляет <code>DOM</code>?</li>
<li>Что такое <code>element</code> в <code>React</code>?</li>
<li>Как работает <code>Reconciliation Algorythm</code> в <code>React</code>?</li>
<li>Когда происходит рендер компонента (вызов рендер метода у компонента)?</li>
<li>Что такое <code>Reducer</code> паттерн?</li>
<li>В чем преемущества/недостатки <code>Multiple State Container</code> (много сервисов) против <code>Single State Container</code> (глобальный)?</li>
<li>Чем отличается <code>React</code> от <code>ReactDOM</code>?</li>
<li>В чем преемущество <code>Hooks API</code> перед <code>Class Components API</code>?</li>
<li>Что такое <code>React Pure Component</code>?</li>
</ul>
<h5 id="практические-вопросы-4">Практические вопросы</h5>
<ol>
<li>На знание <code>React Hooks</code>. Есть React компонент. Какую багу вы видете в этом коде? Как ее можно исправить с помощью <code>React Hooks</code>?</li>
</ol>
<pre class=" language-js"><code class="prism  language-js">  <span class="token comment">// ... some code before</span>
  
  <span class="token function">componentDidMount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    ChatAPI<span class="token punctuation">.</span><span class="token function">subscribeToFriendStatus</span><span class="token punctuation">(</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span>friend<span class="token punctuation">.</span>id<span class="token punctuation">,</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>handleStatusChange
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">componentWillUnmount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    ChatAPI<span class="token punctuation">.</span><span class="token function">unsubscribeFromFriendStatus</span><span class="token punctuation">(</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span>friend<span class="token punctuation">.</span>id<span class="token punctuation">,</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>handleStatusChange
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  
  <span class="token comment">// some code after ...</span>
</code></pre>
<h1 id="для-backend-разработчиков">Для Backend разработчиков</h1>
<ul>
<li>
<p>Вопросы по построению архитектуры, паттерны проектирования</p>
</li>
<li>
<p>SOLID принципы</p>
</li>
<li>
<p>Монолит или микросервисы. Сравните. Что бы выбрали для старта нового приложения и почему?</p>
</li>
<li>
<p>Проектирование реляционных баз данных. Нормальные формы баз данных.</p>
</li>
<li>
<p>Не реляционные базы данных.</p>
</li>
<li>
<p>Стримы.</p>
</li>
<li>
<p>Типовые задачи которые должны решать бекенд разработчики на готовом стеке, без костылей. Сервер очередей, пакетные задания.</p>
</li>
<li>
<p>Вопросы связанные с масштабированием. Шардинг, репликация баз данных горизонтальная, вертикальная.</p>
</li>
<li>
<p>Master-Master базы данных, построение ключей.</p>
</li>
<li>
<p>Docker, Kubernetes, оркестрирование кластера.</p>
</li>
<li>
<p>Серверные фреймворки, express, koa, hapi… валидация данных.</p>
</li>
<li>
<p>JSONP, CORS, уязвимости CSRF, XSS, активные пассивные</p>
</li>
<li>
<p>Service Discovery</p>
</li>
<li>
<p>Мониторинг, метрики, логи. В чем отличие.</p>
</li>
<li>
<p>Основные принципы и ограничения REST</p>
</li>
</ul>
<h1 id="архитектура-приложения">Архитектура приложения</h1>
<ol>
<li>Что такое связность и связанность?</li>
<li>SOLID принципы.</li>
<li>ООП и композиция.</li>
<li>Отличия агрегации от композиции</li>
<li>Функциональный подход в программировании.</li>
<li>Функциональные объекты, функторы, аппликативные функторы, монады.</li>
<li>Архитектурные паттерны: Поведенческие, Порождающие,</li>
<li>Антипаттерны.</li>
</ol>
</div>
</body>

</html>