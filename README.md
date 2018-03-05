install

`npm install divdrag --save`

```html
<div class="divdrag">
    <div class="divdrag-title">Title</div>
    <div class="divdrag-content">
        any content
    </div>
</div>
```


```javascript
new divdrag({
    element: '.divdrag', 
    moveElement: '.divdrag-title',
    classOnMove: 'moving'
});
```

optional
```javascript
{
    marginWindow: 3,
    middle: true,
    movable: false,
    savePosition: true
}
```

