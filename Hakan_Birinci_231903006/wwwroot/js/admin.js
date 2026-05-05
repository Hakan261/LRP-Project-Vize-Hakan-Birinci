document.addEventListener('DOMContentLoaded', async () => {
    await requireRole('Admin');
    setupSidebar();
    loadPage('labs');
});

function setupSidebar() {
    document.querySelectorAll('.sidebar-nav a').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = event.target.dataset.page;
            loadPage(page);
            document.querySelectorAll('.sidebar-nav a').forEach((item) => item.classList.remove('active'));
            event.target.classList.add('active');
        });
    });
}

async function loadPage(page) {
    const content = document.querySelector('#pageContent');
    if (page === 'computers') {
        content.innerHTML = '<h4>Bilgisayar Yönetimi</h4><div id="computersSection"></div>';
        await renderComputers();
    } else if (page === 'assignment') {
        content.innerHTML = '<h4>Öğrenci Atama</h4><div id="assignmentSection"></div>';
        renderAssignmentForm();
    } else {
        content.innerHTML = '<h4>Laboratuvar Yönetimi</h4><div id="labsSection"></div>';
        await renderLabs();
    }
}

async function renderLabs() {
    const section = document.querySelector('#labsSection');
    const labs = await apiFetch('/api/admin/labs');
    section.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4>Laboratuvar Yönetimi</h4>
            <button id="newLabBtn" class="btn btn-success">Yeni Laboratuvar Ekle</button>
        </div>
        <div class="table-responsive">
            <table class="table table-hover table-bordered align-middle">
                <thead class="table-secondary"><tr><th>Ad</th><th>Konum</th><th>Açıklama</th><th style="width:120px;">İşlemler</th></tr></thead>
                <tbody>${labs.length ? labs.map(l => `<tr><td>${l.name}</td><td>${l.location}</td><td>${l.description}</td><td><button class="btn btn-sm btn-danger delete-lab" data-id="${l.id}">Sil</button></td></tr>`).join('') : '<tr><td colspan="4" class="text-center">Kayıtlı laboratuvar yok.</td></tr>'}</tbody>
            </table>
        </div>
    `;

    document.querySelector('#newLabBtn').addEventListener('click', () => {
        section.innerHTML += `
            <div class="card card-body mt-3">
                <h5>Yeni Laboratuvar</h5>
                <form id="labForm">
                    <div class="mb-3"><label class="form-label">Laboratuvar Adı</label><input class="form-control" id="labName" required></div>
                    <div class="mb-3"><label class="form-label">Konum</label><input class="form-control" id="labLocation" required></div>
                    <div class="mb-3"><label class="form-label">Açıklama</label><textarea class="form-control" id="labDescription" rows="3"></textarea></div>
                    <button class="btn btn-primary">Kaydet</button>
                </form>
            </div>
        `;
        document.querySelector('#labForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const payload = {
                name: document.querySelector('#labName').value,
                location: document.querySelector('#labLocation').value,
                description: document.querySelector('#labDescription').value
            };
            await fetch('/api/admin/labs', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            await renderLabs();
        });
    });

    document.querySelectorAll('.delete-lab').forEach(button => {
        button.addEventListener('click', async (event) => {
            const id = event.currentTarget.dataset.id;
            if (!confirm('Bu laboratuvarı silmek istediğinize emin misiniz?')) return;
            const response = await fetch(`/api/admin/labs/${id}`, { method: 'DELETE', credentials: 'include' });
            if (!response.ok) {
                const error = await response.json();
                alert(error.message || 'Laboratuvar silinirken hata oluştu.');
                return;
            }
            await renderLabs();
        });
    });
}

async function renderComputers() {
    const section = document.querySelector('#computersSection');
    const computers = await apiFetch('/api/admin/computers');
    const labs = await apiFetch('/api/admin/labs');
    section.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4>Bilgisayar Yönetimi</h4>
            <button id="newComputerBtn" class="btn btn-success">Yeni Bilgisayar Ekle</button>
        </div>
        <div class="table-responsive">
            <table class="table table-hover table-bordered align-middle">
                <thead class="table-secondary"><tr><th>Kod</th><th>Marka</th><th>İşlemci</th><th>RAM</th><th>Lab</th><th>HDMI</th><th>Veyon</th><th>Öğrenci</th><th style="width:180px;">İşlemler</th></tr></thead>
                <tbody>${computers.length ? computers.map(c => `<tr><td>${c.assetCode}</td><td>${c.brand}</td><td>${c.processor}</td><td>${c.ram}</td><td>${c.lab?.name ?? 'Tanımlı değil'}</td><td>${c.hasHdmi ? 'Evet' : 'Hayır'}</td><td>${c.hasVeyon ? 'Evet' : 'Hayır'}</td><td>${c.assignedUser?.fullName ?? '-'}</td><td>${c.assignedUser ? `<button class="btn btn-sm btn-warning me-1 unassign-computer" data-id="${c.id}">Atamayı Kaldır</button><button class="btn btn-sm btn-danger delete-computer" data-id="${c.id}" disabled title="Atanan bilgisayar silinemez">Sil</button>` : `<button class="btn btn-sm btn-danger delete-computer" data-id="${c.id}">Sil</button>`}</td></tr>`).join('') : '<tr><td colspan="9" class="text-center">Kayıtlı bilgisayar yok.</td></tr>'}</tbody>
            </table>
        </div>
    `;

    document.querySelector('#newComputerBtn').addEventListener('click', () => {
        section.innerHTML += `
            <div class="card card-body mt-3">
                <h5>Yeni Bilgisayar</h5>
                <form id="computerForm">
                    <div class="row g-3">
                        <div class="col-md-6"><label class="form-label">Marka</label><input class="form-control" id="computerBrand" required></div>
                        <div class="col-md-6"><label class="form-label">İşlemci</label><input class="form-control" id="computerProcessor" required></div>
                        <div class="col-md-6"><label class="form-label">RAM</label><input class="form-control" id="computerRam" required></div>
                        <div class="col-md-6"><label class="form-label">Laboratuvar</label><select class="form-select" id="computerLab" required>${labs.map(l => `<option value="${l.id}">${l.name}</option>`).join('')}</select></div>
                        <div class="col-md-6 form-check mt-4"><input class="form-check-input" type="checkbox" id="computerHdmi"><label class="form-check-label" for="computerHdmi">HDMI</label></div>
                        <div class="col-md-6 form-check mt-4"><input class="form-check-input" type="checkbox" id="computerVeyon"><label class="form-check-label" for="computerVeyon">Veyon</label></div>
                    </div>
                    <button class="btn btn-primary mt-3">Bilgisayar Ekle</button>
                </form>
            </div>
        `;
        document.querySelector('#computerForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const payload = {
                brand: document.querySelector('#computerBrand').value,
                processor: document.querySelector('#computerProcessor').value,
                ram: document.querySelector('#computerRam').value,
                labId: parseInt(document.querySelector('#computerLab').value, 10),
                hasHdmi: document.querySelector('#computerHdmi').checked,
                hasVeyon: document.querySelector('#computerVeyon').checked
            };

            try {
                const response = await fetch('/api/admin/computers', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const error = await response.json();
                    alert('Bilgisayar eklenirken hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
                    return;
                }

                alert('Bilgisayar başarıyla eklendi!');
                await renderComputers();
            } catch (error) {
                alert('Sunucuya bağlanılamadı: ' + error.message);
            }
        });
    });

    document.querySelectorAll('.delete-computer').forEach(button => {
        button.addEventListener('click', async (event) => {
            const id = event.currentTarget.dataset.id;
            if (!confirm('Bu bilgisayarı silmek istediğinize emin misiniz?')) return;
            const response = await fetch(`/api/admin/computers/${id}`, { method: 'DELETE', credentials: 'include' });
            if (!response.ok) {
                const error = await response.json();
                alert(error.message || 'Bilgisayar silinirken hata oluştu.');
                return;
            }
            await renderComputers();
        });
    });

    document.querySelectorAll('.unassign-computer').forEach(button => {
        button.addEventListener('click', async (event) => {
            const id = event.currentTarget.dataset.id;
            if (!confirm('Bu bilgisayarın atamasını kaldırmak istediğinize emin misiniz?')) return;
            const response = await fetch(`/api/admin/computers/${id}/unassign`, { method: 'POST', credentials: 'include' });
            if (!response.ok) {
                const error = await response.json();
                alert(error.message || 'Atama kaldırılırken hata oluştu.');
                return;
            }
            alert('Atama başarıyla kaldırıldı.');
            await renderComputers();
        });
    });
}

function renderAssignmentForm() {
    const section = document.querySelector('#assignmentSection');
    section.innerHTML = `
        <div class="card card-body">
            <form id="assignForm">
                <div class="row g-3">
                    <div class="col-md-6"><label class="form-label">Öğrenci No</label><input class="form-control" id="studentNumber" required></div>
                    <div class="col-md-6"><label class="form-label">Ad Soyad</label><input class="form-control" id="studentFullName" required></div>
                    <div class="col-md-6"><label class="form-label">Bilgisayar Seçin</label><select class="form-select" id="computerSelect" required></select></div>
                    <div class="col-md-6"><label class="form-label">Parola</label><input class="form-control" value="ÖğrenciNo@2026" disabled></div>
                </div>
                <button class="btn btn-primary mt-3">Öğrenciyi Ata</button>
            </form>
            <div id="assignmentResult" class="mt-3"></div>
        </div>
    `;

    loadAssignmentComputers();
    document.querySelector('#assignForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const payload = {
            studentNumber: document.querySelector('#studentNumber').value,
            fullName: document.querySelector('#studentFullName').value,
            computerId: parseInt(document.querySelector('#computerSelect').value, 10)
        };

        const response = await fetch('/api/admin/assign', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const result = await response.json();
        const resultBox = document.querySelector('#assignmentResult');

        if (!response.ok) {
            resultBox.innerHTML = `<div class="alert alert-danger">${result.message || 'Atama sırasında hata oluştu.'}</div>`;
            return;
        }

        resultBox.innerHTML = `<div class="alert alert-success">Öğrenci başarıyla atandı. Kullanıcı: ${result.username}, Parola: ${result.password}</div>`;
        loadAssignmentComputers();
    });
}

async function loadAssignmentComputers() {
    const computers = await apiFetch('/api/admin/computers');
    const select = document.querySelector('#computerSelect');
    select.innerHTML = computers
        .filter(c => !c.assignedUser)
        .map(c => `<option value="${c.id}">${c.assetCode} - ${c.brand} (${c.lab?.name || 'Lab yok'})</option>`)
        .join('');

    if (!select.innerHTML) {
        select.innerHTML = '<option value="">Atanmamış bilgisayar yok</option>';
    }
}
