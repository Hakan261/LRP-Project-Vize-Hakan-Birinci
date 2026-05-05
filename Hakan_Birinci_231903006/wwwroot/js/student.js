document.addEventListener('DOMContentLoaded', async () => {
    await requireRole('Student');
    setupSidebar();
    loadStudentOverview();
});

function setupSidebar() {
    document.querySelectorAll('.sidebar-nav a').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            loadStudentOverview();
            document.querySelectorAll('.sidebar-nav a').forEach((item) => item.classList.remove('active'));
            event.target.classList.add('active');
        });
    });
}

async function loadStudentOverview() {
    const content = document.querySelector('#pageContent');
    try {
        const result = await apiFetch('/api/student/computer');
        content.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h5>Zimmetli Bilgisayar Bilgileri</h5>
                </div>
                <div class="card-body">
                    <p><strong>Öğrenci:</strong> ${result.fullName} (${result.studentNumber})</p>
                    <table class="table table-borderless">
                        <tr><th>Demirbaş Kodu:</th><td>${result.computer.assetCode}</td></tr>
                        <tr><th>Marka:</th><td>${result.computer.brand}</td></tr>
                        <tr><th>İşlemci:</th><td>${result.computer.processor}</td></tr>
                        <tr><th>RAM:</th><td>${result.computer.ram}</td></tr>
                        <tr><th>HDMI:</th><td>${result.computer.hasHdmi ? 'Ev' : 'Hayır'}</td></tr>
                        <tr><th>Veyon:</th><td>${result.computer.hasVeyon ? 'Evet' : 'Hayır'}</td></tr>
                        <tr><th>Laboratuvar:</th><td>${result.computer.lab || 'Tanımlı değil'}</td></tr>
                    </table>
                </div>
            </div>
        `;
    } catch (error) {
        content.innerHTML = '<div class="alert alert-warning">Zimmetli bilgisayar bilgisi bulunamadı veya yetkiniz yok.</div>';
    }
}
