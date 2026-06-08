// siwarung-pertemuan13.js
// Penyesuaian Pertemuan 13 untuk project Tugas 2 SiWarung.
// File HTML/CSS utama tetap dipertahankan. Script ini menambah aksi tanpa merombak tampilan.

$(document).ready(function () {
  var hargaBarang = {
    "Rokok A": 15000,
    "Minuman B": 5000,
    "Mie Instan C": 2500
  };

  function formatRupiah(angka) {
    return "Rp " + Number(angka || 0).toLocaleString("id-ID");
  }

  function tampilkanPesanLogin(teks) {
    var pesan = document.getElementById("pesanLogin");
    if (!pesan) {
      pesan = document.createElement("p");
      pesan.id = "pesanLogin";
      pesan.className = "error";
      var form = document.getElementById("loginForm");
      if (form) form.appendChild(pesan);
    }
    pesan.innerHTML = teks;
  }

  // Login sederhana agar halaman login terhubung ke dashboard.
  $("#loginForm").on("submit", function (event) {
    event.preventDefault();
    var username = $("#username").val();
    var password = $("#password").val();

    if (username === "admin" && password === "12345") {
      alert("Login berhasil. Masuk ke Dashboard SiWarung.");
      window.location.href = "dashboard.html";
    } else {
      tampilkanPesanLogin("Username atau password salah. Gunakan admin / 12345.");
    }
  });

  // Efek/action pada dashboard.
  $(".summary-card").on("click", function () {
    var judul = $(this).find("h2").text();
    var nilai = $(this).find("p").text();
    alert(judul + ": " + nilai);
  });

  $(".stock-item").on("click", function () {
    var teks = $(this).text().replace(/\s+/g, " ").trim();
    alert("Detail stok menipis: " + teks);
  });

  // Halaman kelola stok: tombol dibuat aktif tanpa mengubah desain kartu/tabel.
  function refreshStatusStok() {
    $("tbody tr").each(function () {
      var stokCell = $(this).find("td").eq(1);
      var angka = Number(stokCell.text().replace(/[^0-9]/g, ""));
      if (angka <= 3) {
        stokCell.addClass("stock-low");
      } else {
        stokCell.removeClass("stock-low");
      }
    });
  }

  $(".btn-add").on("click", function () {
    var nama = prompt("Masukkan nama barang:");
    if (!nama) return;

    var stok = prompt("Masukkan jumlah stok:", "1");
    if (stok === null || stok === "") return;

    var harga = prompt("Masukkan harga barang:", "1000");
    if (harga === null || harga === "") return;

    var angkaHarga = Number(String(harga).replace(/[^0-9]/g, ""));
    var baris =
      '<tr>' +
        '<td>' + nama + '</td>' +
        '<td class="stock-value">' + stok + '</td>' +
        '<td>' + formatRupiah(angkaHarga) + '</td>' +
        '<td>' +
          '<div class="actions">' +
            '<button class="btn-sm btn-edit" type="button">Edit</button>' +
            '<button class="btn-sm btn-delete" type="button">Hapus</button>' +
          '</div>' +
        '</td>' +
      '</tr>';

    $("tbody").append(baris);
    refreshStatusStok();
    alert("Barang baru berhasil ditambahkan.");
  });

  $(document).on("click", ".btn-edit", function () {
    var row = $(this).closest("tr");
    var nama = row.find("td").eq(0).text();
    var stokLama = row.find("td").eq(1).text();
    var hargaLama = row.find("td").eq(2).text().replace(/[^0-9]/g, "");

    var stokBaru = prompt("Ubah stok untuk " + nama + ":", stokLama);
    if (stokBaru === null || stokBaru === "") return;

    var hargaBaru = prompt("Ubah harga untuk " + nama + ":", hargaLama);
    if (hargaBaru === null || hargaBaru === "") return;

    row.find("td").eq(1).text(stokBaru);
    row.find("td").eq(2).text(formatRupiah(Number(String(hargaBaru).replace(/[^0-9]/g, ""))));
    refreshStatusStok();
    alert("Data stok berhasil diperbarui.");
  });

  $(document).on("click", ".btn-delete", function () {
    var row = $(this).closest("tr");
    var nama = row.find("td").eq(0).text();
    if (confirm("Hapus barang " + nama + " dari daftar stok?")) {
      row.remove();
      alert("Barang berhasil dihapus.");
    }
  });

  // Hitung total otomatis pada halaman input penjualan.
  function hitungTotalPenjualan() {
    var barang = $("#itemSelect").val();
    var jumlah = Number($("#quantityInput").val() || 0);
    var total = (hargaBarang[barang] || 0) * jumlah;
    if (document.getElementById("totalPrice")) {
      $("#totalPrice").val(formatRupiah(total));
    }
  }

  $("#itemSelect").on("change", hitungTotalPenjualan);
  $("#quantityInput").on("input", hitungTotalPenjualan);
  hitungTotalPenjualan();

  // Simpan transaksi penjualan ke tampilan riwayat halaman yang sama.
  $(".btn-submit").on("click", function (event) {
    event.preventDefault();

    var barang = $("#itemSelect").val();
    var jumlah = Number($("#quantityInput").val() || 0);

    if (!barang || jumlah <= 0) {
      alert("Pilih barang dan isi jumlah penjualan terlebih dahulu.");
      return;
    }

    var harga = hargaBarang[barang] || 0;
    var total = harga * jumlah;
    var tanggal = new Date().toLocaleString("id-ID");

    var html = '' +
      '<div class="record-item">' +
        '<div class="record-info">' +
          '<strong>' + barang + '</strong>' +
          '<span>Jumlah: ' + jumlah + ' | Harga: ' + formatRupiah(harga) + '</span>' +
          '<span>Tanggal: ' + tanggal + '</span>' +
        '</div>' +
        '<div class="record-price">' + formatRupiah(total) + '</div>' +
      '</div>';

    if ($(".record-list").length) {
      $(".record-list").prepend(html);
      $(".no-records").hide();
    }

    alert("Transaksi berhasil disimpan dengan JavaScript.");
  });

  // Filter katalog jika halaman katalog memiliki search bar.
  $(".search-bar button").on("click", function () {
    var keyword = ($(".search-bar input").val() || "").toLowerCase();
    $(".product-card").each(function () {
      var teks = $(this).text().toLowerCase();
      if (teks.indexOf(keyword) >= 0) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  $(".btn-add-cart").on("click", function () {
    var namaBarang = $(this).closest(".product-card").find("h2").text();
    alert(namaBarang + " berhasil ditambahkan ke keranjang.");
  });
});
