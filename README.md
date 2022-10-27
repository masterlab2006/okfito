# gulp-pug-starter

## Особенности
* именование классов по [БЭМ](https://ru.bem.info/methodology/naming-convention/)
* файловая структура по [БЭМ](https://ru.bem.info/methodology/filestructure/)
* шаблонизатор – [Pug](https://pugjs.org/) 
* препроцессор – [Stylus](http://stylus-lang.com/)
* поддержки современного JavaScript (ES6) в браузерах – транспайлер [Babel](https://babeljs.io/)
* сборки JavaScript-модулей – [Webpack](https://webpack.js.org/)
* CSS-сетка – [smart-grid](https://github.com/dmitry-lavrik/smart-grid) на основе Bootstrap для быстрой адаптивной вёрстки
* кодгайд – [Stylus Supremacy](https://thisismanta.github.io/stylus-supremacy/)

## Установка
* установите [NodeJS](https://nodejs.org/en/) (если требуется) и [Yarn](https://yarnpkg.com/en/docs/install)
* установите ```gulp``` глобально: ```yarn global add gulp-cli```
* перейдите в скачанную папку со сборкой: ```cd gulp-pug-starter```
* установка зависимостей: ```yarn```
* чтобы начать работу, введите команду: ```yarn run dev``` (режим разработки)
* чтобы собрать проект, введите команду ```yarn run build``` (режим сборки)

Если всё сделано правильно, должен открыться браузер с локальным сервером.
Режим сборки предполагает оптимизацию проекта: сжатие изображений, минифицирование CSS и JS-файлов для загрузки на сервер.

## Файловая структура

```
gulp-pug-starter
├── dist
├── gulp-tasks
├── src
│   ├── blocks
│   ├── fonts
│   ├── img
│   ├── js
│   ├── styles
│   ├── views
│   └── .htaccess
├── gulpfile.babel.js
├── webpack.config.js
├── package.json
├── .babelrc.js
├── .bemrc.js
├── .eslintrc.json
└── .gitignore
```

* Корень папки:
    * ```.babelrc.js``` — настройки Babel
    * ```.bemrc.js``` — настройки БЭМ
    * ```.eslintrc.json``` — настройки ESLint
    * ```.gitignore``` – запрет на отслеживание файлов Git'ом
    * ```gulpfile.babel.js``` — настройки Gulp
    * ```stylus-supremacy.config.json``` – настройки Stylus Supremacy
    * ```webpack.config.js``` — настройки Webpack
    * ```package.json``` — список зависимостей

* Папка ```src``` - используется во время разработки:
    * БЭМ-блоки и компоненты: ```src/blocks```
    * шрифты: ```src/fonts```
    * изображения: ```src/img```
    * JS-файлы: ```src/js```
    * страницы сайта: ```src/views/pages```
    * Stylus-файлы: ```src/styles```
    * служебные Pug-файлы: ```src/views```
    * конфигурационный файл веб-сервера Apache с настройками [gzip](https://habr.com/ru/post/221849/) (сжатие без потерь): ```src/.htaccess```
* Папка ```dist``` - папка, из которой запускается локальный сервер для разработки (при запуске ```yarn run dev```)
* Папка ```gulp-tasks``` - папка с Gulp-тасками

## Команды
* ```yarn run dev``` - запуск сервера для разработки проекта
* ```yarn run build``` - собрать проект с оптимизацией без запуска сервера
* ```yarn run build:views``` - скомпилировать Pug-файлы
* ```yarn run build:styles``` - скомпилировать Stylus-файлы
* ```yarn run build:scripts``` - собрать JS-файлы
* ```yarn run build:images``` - собрать изображения
* ```yarn run build:webp``` - сконвертировать изображения в формат ```.webp```
* ```yarn run build:sprites```- собрать спрайты
* ```yarn run build:fonts``` - собрать шрифты
* ```yarn run build:favicons``` - собрать фавиконки
* ```yarn run build:gzip``` - собрать конфигурацию Apache
* ```yarn run prettify:stylus``` - привести файли стилей в сообветствие с кодгайдом

## Рекомендации по использованию
### Компонентный подход к разработке сайтов
* каждый БЭМ-блок имеет свою папку внутри ```src/blocks/modules```
* папка одного БЭМ-блока содержит в себе один Pug-файл, один Stylus-файл и один JS-файл (если у блока используется скрипт)
    * Pug-файл блока импортируется в файл ```src/views/index.pug``` (или в необходимый файл страницы, откуда будет вызываться блок)
    * Stylus-файл блока импортируется в файл ```src/blocks/modules/modules.styl```
    * JS-файл блока импортируется в ```src/js/import/modules.js```

Пример структуры папки с БЭМ-блоком:
```
blocks
├── modules
│   ├── header
│   │   ├── header.pug
│   │   ├── header.js
│   │   ├── header.styl
```
Чтобы вручную не создавать соответствующие папку и файлы, достаточно в консоли прописать следующие команды:
* ```bem create my-block``` - для создания папки БЭМ-блока, где ```my-block``` - имя БЭМ-блока
* ```bem create my-component -l src/blocks/components``` для создания компонента
* ```bem create my-component -l src/blocks/components && bem create my-block``` - создать всё вместе

### Компоненты
* компоненты (например, иконки, кнопки) оформляются в Pug с помощью примесей
* каждый компонент имеет свою папку внутри ```src/blocks/components```
* папка одного компонента содержит в себе один Pug-файл, один Stylus-файл и один JS-файл (если у компонента используется скрипт)
    * Pug-файл компонента импортируется в файл главной страницы ```src/views/index.pug``` (или в необходимый файл страницы, откуда будет вызываться компонент)
    * Stylus-файл компонента импортируется в файл ```src/blocks/components/components.styl```
    * JS-файл компонента импортируется в файл ```src/js/import/components.js```

### Страницы проекта
* страницы проекта находятся в папке ```src/views/pages```
    * каждая страница (в том числе главная) наследует шаблон ```src/views/layouts/default.pug```
    * главная страница: ```src/views/index.pug```

### Шрифты
* шрифты находятся в папке ```src/fonts```
    * используйте [форматы](https://caniuse.com/#search=woff) ```.woff``` и ```.woff2```
    * шрифты подключаются в файл ```src/styles/layout/fonts.styl```
    * сконвертировать локальные шрифты можно с помощью [данного сервиса](https://onlinefontconverter.com/)

### Изображения
* изображения находятся в папке ```src/img```
    * изображение для генерации фавиконок должно находиться в папке ```src/img/favicon``` и иметь размер не менее ```1024px x 1024px```
    * изображения автоматически конвертируются в формат ```.webp```. Подробная информация по использованию [тут](https://vk.com/@vk_it-webp).

### Сторонние библиотеки
* все сторонние библиотеки устанавливаются в папку ```node_modules```
    * для их загрузки воспользуйтеcь командой ```yarn add package_name```
    * для подключения JS-файлов библиотек импортируйте их в самом начале JS-файла БЭМ-блока (то есть тот БЭМ-блок, который использует скрипт), например:
    ```javascript
    import $ from "jquery";
    ```
    * для подключения стилевых файлов библиотек импортируйте их в файл ```src/styles/vendor/libs.styl```
    * JS-файлы и стилевые файлы библиотек самостоятельно изменять нельзя

:warning: Если в вашем проекте используется несколько библиотек, которые необходимо подключать на нескольких страницах, во избежании ошибок нужно:
* по пути ```src/js/import``` создать папку ```pages```
* в папке ```pages``` создать js-файл для страницы, например, ```pageA.js```, и импортировать туда библиотеку, которая будет использоваться только на этой странице
    * аналогично проделать шаг для дополнительных страниц
* в файле ```webpack.config.js``` в точку входа добавить js-файлы страниц, пример:
```javascript
entry: {
    main: "./src/js/index.js",
    pageA: "./src/js/import/pages/pageA.js",
    pageB: "./src/js/import/pages/pageB.js"
}
```
* подключить скомпилированные js-файлы на необходимых страницах

## CSS-сетка smart-grid
В сборщик включена CSS-сетка [smart-grid](https://github.com/dmitry-lavrik/smart-grid) от [Дмитрия Лаврика](https://dmitrylavrik.ru/). Она позволяет избавиться от
лишних классов в разметке за счёт использования примесей в Stylus и ускоряет адаптивную вёрстку. Конфигурация уже настроена в соответствии с сеткой [Bootstrap](https://getbootstrap.com/). Пример использования:

**Stylus**
```stylus
.items
    row-flex()
    md(justify-content, center)

    .item
        col()
        size(3)
        size-md(5)
        size-xs(10)
```
**Результат**
```css
.items {
    display: flex;
    flex-wrap: wrap;
    margin-left: -15px;
    margin-right: -15px;
}
.items .item {
    box-sizing: border-box;
    margin-left: 15px;
    margin-right: 15px;
    word-wrap: break-word;
    width: calc(100% / 12 * 3 - 30px);
}
@media screen and (max-width: 992px) {
    .items {
        justify-content: center;
    }
    .items .item {
        width: calc(100% / 12 * 5 - 30px);
    }
}
@media screen and (max-width: 576px) {
    .items .item {
        width: calc(100% / 12 * 10 - 30px);
    }
}
```