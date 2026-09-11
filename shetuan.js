const form = document.querySelector('#add-form');
const nameInput = document.querySelector('#name-input');
const gradeInput = document.querySelector('#grade-input');
const deptInput = document.querySelector('#dept-input');
const tip = document.querySelector('#tip');
const list = document.querySelector('#member-list');
const searchInput = document.querySelector('#search-input');
const submitBtn = document.querySelector('#submit-btn');

let members = JSON.parse(localStorage.getItem('members') || '[]');
let editId = null;

const save = () => localStorage.setItem('members', JSON.stringify(members));

const render = () => {
    list.innerHTML = '';
    const keyword = searchInput.value.trim();
    const shown = keyword === '' ? members : members.filter(m => m.name.includes(keyword));
    if (shown.length === 0) {
        const li = document.createElement('li');
        li.textContent = keyword === '' ? '暂无成员' : '没有符合条件的成员';
        list.appendChild(li);
        return;
    }
    shown.forEach(member => {
        const li = document.createElement('li');
        const nameEl = document.createElement('strong');
        nameEl.textContent = member.name;
        const metaEl = document.createElement('span');
        metaEl.className = 'meta';
        metaEl.textContent = member.grade + '年级 · ' + member.dept;
        li.appendChild(nameEl);
        li.appendChild(metaEl);

        const editBtn = document.createElement('button');
        editBtn.className = 'btn';
        editBtn.textContent = '编辑';
        editBtn.addEventListener('click', () => startEdit(member.id));

        const delBtn = document.createElement('button');
        delBtn.className = 'btn';
        delBtn.textContent = '删除';
        delBtn.addEventListener('click', () => removeMember(member.id));

        li.appendChild(editBtn);
        li.appendChild(delBtn);
        list.appendChild(li);
    });
};

const validate = (name, grade, dept, ignoreId) => {
    if (name === '') return '姓名不能为空';
    if (members.some(m => m.name === name && m.id !== ignoreId)) return '该成员已存在';
    if (grade === '' || isNaN(Number(grade))) return '年级必须是数字';
    if (Number(grade) < 1 || Number(grade) > 4) return '年级范围为 1-4';
    if (dept === '') return '部门不能为空';
    return '';
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const grade = gradeInput.value.trim();
    const dept = deptInput.value.trim();
    const err = validate(name, grade, dept, editId);
    if (err !== '') {
        tip.textContent = err;
        return;
    }
    if (editId === null) {
        members.push({ id: Date.now(), name: name, grade: grade, dept: dept });
    } else {
        const member = members.find(m => m.id === editId);
        member.name = name;
        member.grade = grade;
        member.dept = dept;
    }
    save();
    cancelEdit();
    render();
});

const startEdit = (id) => {
    const member = members.find(m => m.id === id);
    editId = id;
    nameInput.value = member.name;
    gradeInput.value = member.grade;
    deptInput.value = member.dept;
    submitBtn.textContent = '保存修改';
    tip.style.color = '#06c';
    tip.textContent = '正在编辑「' + member.name + '」，填写后点击保存修改';
};

const cancelEdit = () => {
    editId = null;
    form.reset();
    submitBtn.textContent = '添加';
    tip.style.color = '';
    tip.textContent = '';
};

const removeMember = (id) => {
    members = members.filter(m => m.id !== id);
    save();
    if (editId === id) cancelEdit();
    render();
};

searchInput.addEventListener('input', render);

render();
