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
    savePosition: true
});
```

optional
```javascript
{
    opacityOnMove: 0.5,
    marginWindow: 3
}
```

