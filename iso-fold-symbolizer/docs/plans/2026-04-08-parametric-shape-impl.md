# Parametric Shape System — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace 6 hardcoded piece shapes with a unified parametric shape generator controlled by 5 continuous sliders (sides, skew, indent, pinch, point), keeping old shapes as preset shortcuts.

**Architecture:** Single function `plankPts()` rewritten to generate an n-gon base polygon then apply 4 deformation passes (skew, point, pinch, indent). Presets become button shortcuts that set slider values. All changes in `iso-icon-generator.html`.

**Tech Stack:** Vanilla JS, single HTML file, no dependencies.

---

### Task 1: Replace P.ps with new shape parameters

**Files:**
- Modify: `iso-icon-generator.html:173` (P defaults)

**Step 1: Update parameter object**

Change line 173 from:
```js
var P={sym:0,as:4,wd:0.88,ht:0.85,ta:0.25,ga:0,sp:0,bd:0,rn:0,rc:[1,1,1,1],bg:'#ffffff',sc:0,gr:5,sh:6,ps:0};
```
to:
```js
var P={sym:0,as:4,wd:0.88,ht:0.85,ta:0.25,ga:0,sp:0,bd:0,rn:0,rc:[1,1,1,1],bg:'#ffffff',sc:0,gr:5,sh:6,pn:4,pk:0,pi:0,pp:0,pe:0};
```

Note: using `pe` for "point/end" since `pt` conflicts with the existing `pt()` helper function inside `plankPts`.

---

### Task 2: Rewrite plankPts() with parametric shape generator

**Files:**
- Modify: `iso-icon-generator.html:522-565` (plankPts function)

**Step 1: Replace the entire plankPts function**

Replace the current `plankPts` function (lines 522-565) with:

```js
function plankPts(q1,r1,q2,r2,pol){
  var p1x=S*(q1+r1*0.5),p1y=S*r1*0.866;
  var p2x=S*(q2+r2*0.5),p2y=S*r2*0.866;
  var dx=p2x-p1x,dy=p2y-p1y;
  var len=Math.sqrt(dx*dx+dy*dy);
  var ux=dx/len,uy=dy/len,nx=-uy,ny=ux;

  var halfW=H*P.wd;
  var narrowW=halfW*(1-P.ta);
  var halfL=H*P.ht;
  if(halfL<2)halfL=2;

  var w1=(pol[nKey(q1,r1)]===1)?narrowW:halfW;
  var w2=(pol[nKey(q2,r2)]===1)?narrowW:halfW;

  // Gap: offset midpoint outward from grid origin along edge axis
  var cx=(p1x+p2x)/2,cy=(p1y+p2y)/2;
  var odist=Math.sqrt(cx*cx+cy*cy);
  var ox=odist>0?cx/odist*P.ga:0,oy=odist>0?cy/odist*P.ga:0;
  var mx=cx+ox,my=cy+oy;
  function mkpt(a,n){return[mx+ux*a+nx*n,my+uy*a+ny*n]}
  var avgW=(w1+w2)/2;
  function tag(arr){arr._mx=mx;arr._my=my;arr._ux=ux;arr._uy=uy;arr._nx=nx;arr._ny=ny;arr._halfL=halfL;arr._avgW=avgW;return arr}

  // --- 1. Generate base n-gon in local coords (along, across) ---
  var n=Math.round(P.pn);
  var verts=[]; // each: [along, across]
  for(var i=0;i<n;i++){
    var ang=2*Math.PI*i/n - Math.PI/2; // start at top
    var rawA=Math.cos(ang); // -1 to 1 along axis
    var rawN=Math.sin(ang); // -1 to 1 across axis
    // Scale: along by halfL, across by interpolated width based on along position
    var t=(rawA+1)/2; // 0 at node1 end, 1 at node2 end
    var w=w1+(w2-w1)*t;
    verts.push([rawA*halfL, rawN*w]);
  }

  // --- 2. Apply skew: shift along proportional to across ---
  if(P.pk!==0){
    for(var i=0;i<verts.length;i++){
      verts[i][0]+=verts[i][1]*P.pk;
    }
  }

  // --- 3. Apply point: sharpen ends by collapsing across toward 0 ---
  if(P.pe!==0){
    for(var i=0;i<verts.length;i++){
      var endProx=Math.abs(verts[i][0])/halfL; // 0 at center, 1 at ends
      verts[i][1]*=(1-P.pe*endProx);
    }
  }

  // --- 4. Apply pinch: narrow at midpoint ---
  if(P.pp!==0){
    for(var i=0;i<verts.length;i++){
      var centerProx=1-Math.abs(verts[i][0])/halfL; // 1 at center, 0 at ends
      verts[i][1]*=(1-P.pp*centerProx);
    }
  }

  // --- 5. Apply indent: insert offset midpoints on each edge ---
  if(P.pi!==0){
    var indented=[];
    for(var i=0;i<verts.length;i++){
      var j=(i+1)%verts.length;
      indented.push(verts[i]);
      // Edge midpoint
      var ma=(verts[i][0]+verts[j][0])/2;
      var mn=(verts[i][1]+verts[j][1])/2;
      // Edge normal (perpendicular, pointing inward)
      var ea=verts[j][0]-verts[i][0];
      var en=verts[j][1]-verts[i][1];
      var el=Math.sqrt(ea*ea+en*en);
      if(el>0.01){
        // Normal points inward (toward center)
        var nna=-en/el, nnn=ea/el;
        // Flip if normal points away from center
        if(nna*ma+nnn*mn>0){nna=-nna;nnn=-nnn}
        var strength=el*0.3*P.pi; // scale by edge length
        indented.push([ma+nna*strength, mn+nnn*strength]);
      }
    }
    verts=indented;
  }

  // --- 6. Convert to global coords ---
  var pts=[];
  for(var i=0;i<verts.length;i++){
    pts.push(mkpt(verts[i][0],verts[i][1]));
  }
  return tag(pts);
}
```

**Key changes from original:**
- `pt()` helper renamed to `mkpt()` to avoid conflict with `P.pe` (was `pt` in design, renamed to `pe`)
- Base n-gon generated from `P.pn` sides
- Width interpolated per-vertex based on along position (preserves taper behavior)
- 4 deformation passes applied in sequence
- No more `if(P.ps===0)` branching — one unified path

---

### Task 3: Update HTML — rename section, add sliders

**Files:**
- Modify: `iso-icon-generator.html:104-119` (Geometry section HTML)

**Step 1: Replace the Geometry section**

Replace lines 104-119 (the `<details class="section" open>` for Geometry through its `</details>`) with:

```html
<details class="section" open>
<summary>Shape</summary>
<p class="section-desc">Piece shape and deformation</p>

<div class="s"><label title="Preset shape configurations">Shape</label>
<div class="bb" id="psb"></div></div>

<div class="s"><div class="r"><label title="Number of sides on the base polygon">Sides</label><span id="pnv">4</span></div>
<input type="range" min="3" max="8" step="1" value="4" id="pn" oninput="P.pn=+this.value;$('pnv').textContent=this.value;throttledRerender()"></div>

<div class="s"><div class="r"><label title="Shifts vertices along edge axis (parallelogram/rhombus effect)">Skew</label><span id="pkv">0</span></div>
<input type="range" min="-1" max="1" step="0.01" value="0" id="pk" oninput="P.pk=+this.value;$('pkv').textContent=(+this.value).toFixed(2);throttledRerender()"></div>

<div class="s"><div class="r"><label title="Pull edge midpoints inward (+) or outward (-) for concave/convex effects">Indent</label><span id="piv">0</span></div>
<input type="range" min="-1" max="1" step="0.01" value="0" id="pi" oninput="P.pi=+this.value;$('piv').textContent=(+this.value).toFixed(2);throttledRerender()"></div>

<div class="s"><div class="r"><label title="Narrow the shape at its midpoint (hourglass/waist effect)">Pinch</label><span id="ppv">0</span></div>
<input type="range" min="0" max="1" step="0.01" value="0" id="pp" oninput="P.pp=+this.value;$('ppv').textContent=(+this.value).toFixed(2);throttledRerender()"></div>

<div class="s"><div class="r"><label title="Sharpen ends by collapsing toward centerline (diamond/arrow effect)">Point</label><span id="pev">0</span></div>
<input type="range" min="0" max="1" step="0.01" value="0" id="pe" oninput="P.pe=+this.value;$('pev').textContent=(+this.value).toFixed(2);throttledRerender()"></div>

<div class="s"><div class="r"><label title="How wide each piece is perpendicular to its edge">Width</label><span id="wv">0.88</span></div>
<input type="range" min="0.1" max="4.0" step="0.01" value="0.88" id="wd" oninput="P.wd=+this.value;throttledRerender()"></div>

<div class="s"><div class="r"><label title="How long each piece is along its edge">Height</label><span id="hv">0.85</span></div>
<input type="range" min="0.1" max="4.0" step="0.01" value="0.85" id="ht" oninput="P.ht=+this.value;throttledRerender()"></div>

<div class="s"><div class="r"><label title="Narrowing at alternating nodes (0 = uniform, 1 = full taper)">Taper</label><span id="tv">0.25</span></div>
<input type="range" min="0" max="1.0" step="0.01" value="0.25" id="ta" oninput="P.ta=+this.value;throttledRerender()"></div>
</details>
```

---

### Task 4: Update piece shape buttons to set parametric values

**Files:**
- Modify: `iso-icon-generator.html:736-743` (Piece shape buttons IIFE)

**Step 1: Replace the piece shape buttons initialization**

Replace lines 736-743 with:

```js
// --- Shape preset buttons ---
var SHAPE_PRESETS=[
  {l:'bar',    pn:4,pk:0,pi:0,pp:0,pe:0},
  {l:'diamond',pn:4,pk:0,pi:0,pp:0,pe:1},
  {l:'hex',    pn:6,pk:0,pi:0,pp:0,pe:0},
  {l:'arrow',  pn:3,pk:0,pi:0,pp:0,pe:0.5},
  {l:'chevron',pn:4,pk:0,pi:-0.5,pp:0,pe:0.5},
  {l:'hourglass',pn:4,pk:0,pi:0,pp:1,pe:0}
];
(function(){
  SHAPE_PRESETS.forEach(function(s,i){
    var b=document.createElement('button');b.textContent=s.l;b.dataset.v=i;
    b.onclick=function(){
      P.pn=s.pn;P.pk=s.pk;P.pi=s.pi;P.pp=s.pp;P.pe=s.pe;
      syncShapeSliders();updBtns();rerender();
    };
    $('psb').appendChild(b);
  });
})();
```

---

### Task 5: Add syncShapeSliders helper and update updBtns/updateReadouts

**Files:**
- Modify: `iso-icon-generator.html` (near updBtns/updateReadouts functions)

**Step 1: Add syncShapeSliders function** (after `updateReadouts`):

```js
function syncShapeSliders(){
  $('pn').value=P.pn;$('pnv').textContent=Math.round(P.pn);
  $('pk').value=P.pk;$('pkv').textContent=P.pk.toFixed(2);
  $('pi').value=P.pi;$('piv').textContent=P.pi.toFixed(2);
  $('pp').value=P.pp;$('ppv').textContent=P.pp.toFixed(2);
  $('pe').value=P.pe;$('pev').textContent=P.pe.toFixed(2);
}
```

**Step 2: Update updBtns** — replace the `psb` line:

Change:
```js
$('psb').querySelectorAll('button').forEach(function(b){b.className=+b.dataset.v===P.ps?'on':''});
```
to:
```js
$('psb').querySelectorAll('button').forEach(function(b,i){
  var s=SHAPE_PRESETS[i];
  b.className=(s&&P.pn===s.pn&&P.pk===s.pk&&P.pi===s.pi&&P.pp===s.pp&&P.pe===s.pe)?'on':'';
});
```

**Step 3: Update updateReadouts** — add shape slider sync:

Add `syncShapeSliders();` at the end of `updateReadouts()`, before `updBtns();`.

---

### Task 6: Update resetDefaults, copySeed, loadPreset

**Files:**
- Modify: `iso-icon-generator.html:763` (resetDefaults)
- Modify: `iso-icon-generator.html:793` (copySeed)
- Modify: `iso-icon-generator.html:828` (loadPreset)

**Step 1: Update resetDefaults**

In the defaults object, remove `ps:0` (if present) and add `pn:4,pk:0,pi:0,pp:0,pe:0`. Add shape sliders to the sync map:
```js
var sliders={wd:'wd',ht:'ht',ga:'ga',sp:'sp',bd:'bd',ta:'ta',rn:'rn',as:'as',sc:'sc',gr:'gr',pn:'pn',pk:'pk',pi:'pi',pp:'pp',pe:'pe'};
```

**Step 2: Update copySeed**

Replace the piece name lookup with parametric values:
```js
var info='Seed: '+icon.seed+' | Sym: '+['6-fold','3-mirror','3-flip','dihedral','2-mirror','3-fold','2-fold','mirror'][P.sym]+' | Sides: '+Math.round(P.pn)+' | Skew: '+P.pk+' | Indent: '+P.pi+' | Pinch: '+P.pp+' | Point: '+P.pe+' | Shape: '+(P.sh>=36?'circle':P.sh)+' | Grid: '+P.gr+' | Arm: '+P.as+' | Scatter: '+P.sc+' | Total: '+totalPieces()+' | Width: '+P.wd+' | Height: '+P.ht+' | Gap: '+P.ga+' | Spacing: '+P.sp+' | Taper: '+P.ta;
```

**Step 3: Update loadPreset for backward compat**

After the `for` loop that copies params, add migration for old presets:
```js
// Migrate old P.ps integer to new parametric values
if(typeof P.ps==='number'&&SHAPE_PRESETS[P.ps]){
  var sp=SHAPE_PRESETS[P.ps];
  P.pn=sp.pn;P.pk=sp.pk;P.pi=sp.pi;P.pp=sp.pp;P.pe=sp.pe;
}
delete P.ps;
```

Also add shape sliders to the sync loop:
```js
var sliders={wd:'wd',ht:'ht',ga:'ga',sp:'sp',bd:'bd',ta:'ta',rn:'rn',as:'as',sc:'sc',gr:'gr',pn:'pn',pk:'pk',pi:'pi',pp:'pp',pe:'pe'};
```

---

### Task 7: Update log and verify

**Step 1: Add log entry to docs/log.md**

**Step 2: Verify in browser**

1. Open `iso-icon-generator.html`
2. Verify "Shape" section shows with preset buttons + 5 new sliders + width/height/taper
3. Click each preset button — verify sliders update and icons change to match old shapes
4. Drag Sides slider 3→8 — verify polygon changes
5. Drag Skew — verify parallelogram effect
6. Drag Indent positive/negative — verify concave/convex midpoints
7. Drag Pinch — verify hourglass narrowing
8. Drag Point — verify end sharpening
9. Combine: set sides=5, skew=0.3, indent=0.2, point=0.5 — verify novel shape
10. Verify Width/Height/Taper still work as before
11. Verify Rounding (including per-corner) still works
12. Click Reset — verify all shape sliders return to defaults
13. Save a preset, reload, load it — verify shape params preserved
