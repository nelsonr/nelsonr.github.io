+++
title = 'CSS transitions with clip-path: Part II'
date = '2025-05-10'
draft = true
+++

## Color fill transition

Now for something completely different. So far we've seen how to use `clip-path` property to create mask effects but there are other effects possible, such as a color fill.

<style>
.transitions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    justify-items: center;
    gap: 1em;
}

.card {
    display: grid;
    cursor: pointer;
    font-size: 1.1em;
    line-height: 1;
}

.card__default,
.card__transition {
    grid-column: 1;
    grid-row: 1;
    width: 200px;
    height: 200px;
    background-color: #131313;
    display: flex;
    justify-content: center;
    align-items: center;
    color: hotpink;
    font-weight: bold;
}

.card__transition {
    color: #131313;
    background-color: hotpink;
    clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);
    transition: all 200ms ease-out;
}

.ex-01:hover .card__transition {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}

.ex-02 .card__transition {
    clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%);
}

.ex-02:hover .card__transition {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}

.ex-03:hover .card__transition {
    clip-path: polygon(0% 0%, 200% 0%, 100% 100%, 0% 100%);
}

.ex-04:hover .card__transition {
    clip-path: polygon(0% 0%, 100% 0%, 200% 100%, 0% 100%);
}
</style>
<div class="example">
    <div class="transitions">
        <div class="card ex-01">
            <div class="card__default">
                <div class="card__title">Hover me</div>
            </div>
            <div class="card__transition">
                <div class="card__title">Hover me</div>
            </div>
        </div>
        <div class="card ex-02">
            <div class="card__default">
                <div class="card__title">Hover me</div>
            </div>
            <div class="card__transition">
                <div class="card__title">Hover me</div>
            </div>
        </div>
        <div class="card ex-03">
            <div class="card__default">
                <div class="card__title">Hover me</div>
            </div>
            <div class="card__transition">
                <div class="card__title">Hover me</div>
            </div>
        </div>
        <div class="card ex-04">
            <div class="card__default">
                <div class="card__title">Hover me</div>
            </div>
            <div class="card__transition">
                <div class="card__title">Hover me</div>
            </div>
        </div>
    </div>
</div>
