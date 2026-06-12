$(document).ready(function () {
  var hargaBarang = {
    "Rokok A": 15000,
    "Air Mineral": 5000,
    "Mie Instan C": 2500,
    "Beras 5 Kg": 72000,
    "Gula 1 Kg": 17000,
    "Kopi Sachet": 1500
  };

  function formatRupiah(angka) {
    return "Rp " + Number(angka || 0).toLocaleString("id-ID");
  }

  function tampilkanToast(teks, tipe) {
    tipe = tipe || "primary";
    var warna = tipe === "danger" ? "text-bg-danger" : tipe === "success" ? "text-bg-success" : tipe === "warning" ? "text-bg-warning" : "text-bg-primary";
    var ikon = tipe === "danger" ? "bi-exclamation-circle" : tipe === "success" ? "bi-check-circle" : tipe === "warning" ? "bi-exclamation-triangle" : "bi-info-circle";

    if ($("#toastArea").length === 0) {
      $("body").append('<div id="toastArea" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1100;"></div>');
    }

    var id = "toast" + Date.now();
    var closeClass = tipe === "warning" ? "btn-close" : "btn-close btn-close-white";
    var toastHtml = '' +
      '<div id="' + id + '" class="toast align-items-center border-0 shadow-lg ' + warna + '" role="alert" aria-live="assertive" aria-atomic="true">' +
        '<div class="d-flex">' +
          '<div class="toast-body fw-semibold">' +
            '<i class="bi ' + ikon + ' me-2"></i>' + teks +
          '</div>' +
          '<button type="button" class="' + closeClass + ' me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
        '</div>' +
      '</div>';

    $("#toastArea").append(toastHtml);
    var elemenToast = document.getElementById(id);
    var toast = new bootstrap.Toast(elemenToast, { delay: 2300 });
    elemenToast.addEventListener("hidden.bs.toast", function () {
      elemenToast.remove();
    });
    toast.show();
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

  $("#loginForm").on("submit", function (event) {
    event.preventDefault();
    var username = $("#username").val().trim().toLowerCase();
    var password = $("#password").val().trim();

    if (username === "admin" && password === "12345") {
      localStorage.setItem("siwarungRole", "admin");
      tampilkanToast("Login admin berhasil. Masuk ke Dashboard.", "success");
      setTimeout(function () { window.location.href = "dashboard.html"; }, 650);
    } else if (username === "pelanggan" && password === "12345") {
      localStorage.setItem("siwarungRole", "pelanggan");
      tampilkanToast("Login pelanggan berhasil. Masuk ke Katalog.", "success");
      setTimeout(function () { window.location.href = "katalog.html"; }, 650);
    } else {
      tampilkanPesanLogin("Username atau password salah. Gunakan admin / 12345 atau pelanggan / 12345.");
    }
  });

  $(".summary-card").on("click", function () {
    var judul = $(this).find("h2").text();
    var nilai = $(this).find("p").text();
    tampilkanToast(judul + ": " + nilai, "primary");
  });

  $(".stock-item").on("click", function () {
    var teks = $(this).text().replace(/\s+/g, " ").trim();
    tampilkanToast("Detail stok menipis: " + teks, "primary");
  });

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
            '<button class="btn btn-sm btn-outline-primary btn-edit" type="button">Edit</button>' +
            '<button class="btn btn-sm btn-outline-danger btn-delete" type="button">Hapus</button>' +
          '</div>' +
        '</td>' +
      '</tr>';

    $("tbody").append(baris);
    refreshStatusStok();
    tampilkanToast("Barang baru berhasil ditambahkan.", "success");
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
    tampilkanToast("Data stok berhasil diperbarui.", "success");
  });

  $(document).on("click", ".btn-delete", function () {
    var row = $(this).closest("tr");
    var nama = row.find("td").eq(0).text();
    if (confirm("Hapus barang " + nama + " dari daftar stok?")) {
      row.remove();
      tampilkanToast("Barang berhasil dihapus.", "success");
    }
  });

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

  $(".btn-submit").on("click", function (event) {
    event.preventDefault();

    var barang = $("#itemSelect").val();
    var jumlah = Number($("#quantityInput").val() || 0);

    if (!barang || jumlah <= 0) {
      tampilkanToast("Pilih barang dan isi jumlah penjualan terlebih dahulu.", "danger");
      return;
    }

    var harga = hargaBarang[barang] || 0;
    var total = harga * jumlah;
    var tanggal = new Date().toLocaleString("id-ID");

    var html = '' +
      '<div class="record-item">' +
        '<div class="record-info">' +
          '<strong>' + barang + '</strong><br>' +
          '<span>Jumlah: ' + jumlah + ' | Harga: ' + formatRupiah(harga) + '</span><br>' +
          '<span>Tanggal: ' + tanggal + '</span>' +
        '</div>' +
        '<div class="record-price fw-bold text-primary">' + formatRupiah(total) + '</div>' +
      '</div>';

    if ($(".record-list").length) {
      $(".record-list").prepend(html);
      $(".no-records").hide();
    }

    tampilkanToast("Transaksi berhasil disimpan.", "success");
  });

  $(".search-bar button").on("click", function () {
    var keyword = ($(".search-bar input").val() || "").toLowerCase();
    $(".product-card").each(function () {
      var teks = $(this).text().toLowerCase();
      $(this).closest(".col-sm-6, .col-lg-4").toggle(teks.indexOf(keyword) >= 0);
    });
  });

  $(".search-bar input").on("keyup", function (e) {
    if (e.key === "Enter") {
      $(".search-bar button").trigger("click");
    }
  });

  function ambilCart() {
    return JSON.parse(localStorage.getItem("siwarungCart") || "[]");
  }

  function simpanCart(cart) {
    localStorage.setItem("siwarungCart", JSON.stringify(cart));
  }

  function ambilHistory() {
    return JSON.parse(localStorage.getItem("siwarungBuyerHistory") || "[]");
  }

  function simpanHistory(history) {
    localStorage.setItem("siwarungBuyerHistory", JSON.stringify(history));
  }

  function renderCart() {
    if (!$("#cartList").length) return;

    var cart = ambilCart();
    var totalItem = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    var totalHarga = cart.reduce(function (sum, item) { return sum + item.qty * item.price; }, 0);

    $("#cartBadge").text(totalItem);
    $("#cartTotal").text(formatRupiah(totalHarga));

    if (cart.length === 0) {
      $("#cartList").html('<div class="empty-state">Keranjang masih kosong. Pilih produk terlebih dahulu.</div>');
      return;
    }

    var html = "";
    cart.forEach(function (item, index) {
      html += '' +
        '<div class="cart-item">' +
          '<div>' +
            '<div class="cart-item-title">' + item.name + '</div>' +
            '<div class="cart-item-meta">' + formatRupiah(item.price) + ' / ' + item.unit + '</div>' +
            '<div class="cart-item-meta">Subtotal: ' + formatRupiah(item.price * item.qty) + '</div>' +
          '</div>' +
          '<div class="text-end">' +
            '<div class="qty-control mb-2">' +
              '<button class="btn btn-outline-primary btn-sm btn-cart-minus" data-index="' + index + '" type="button">−</button>' +
              '<strong>' + item.qty + '</strong>' +
              '<button class="btn btn-outline-primary btn-sm btn-cart-plus" data-index="' + index + '" type="button">+</button>' +
            '</div>' +
            '<button class="btn btn-outline-danger btn-sm btn-cart-remove" data-index="' + index + '" type="button">Hapus</button>' +
          '</div>' +
        '</div>';
    });

    $("#cartList").html(html);
  }

  function renderHistory() {
    if (!$("#historyList").length) return;

    var history = ambilHistory();
    if (history.length === 0) {
      $("#historyList").html('<div class="empty-state">Belum ada riwayat belanja.</div>');
      return;
    }

    var html = "";
    history.forEach(function (item) {
      html += '' +
        '<div class="history-item">' +
          '<div>' +
            '<div class="history-title">' + item.kode + '</div>' +
            '<div class="history-meta">' + item.tanggal + '</div>' +
            '<div class="history-meta">' + item.ringkasan + '</div>' +
          '</div>' +
          '<strong>' + formatRupiah(item.total) + '</strong>' +
        '</div>';
    });
    $("#historyList").html(html);
  }

  $(document).on("click", ".btn-add-cart", function () {
    var card = $(this).closest(".product-card");
    var name = card.data("product");
    var price = Number(card.data("price"));
    var unit = card.data("unit") || "pcs";
    var cart = ambilCart();
    var existing = cart.find(function (item) { return item.name === name; });

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name: name, price: price, unit: unit, qty: 1 });
    }

    simpanCart(cart);
    renderCart();
    tampilkanToast(name + " masuk ke keranjang.", "success");
  });

  $(document).on("click", ".btn-cart-plus", function () {
    var index = Number($(this).data("index"));
    var cart = ambilCart();
    if (cart[index]) cart[index].qty += 1;
    simpanCart(cart);
    renderCart();
  });

  $(document).on("click", ".btn-cart-minus", function () {
    var index = Number($(this).data("index"));
    var cart = ambilCart();
    if (cart[index]) {
      cart[index].qty -= 1;
      if (cart[index].qty <= 0) cart.splice(index, 1);
    }
    simpanCart(cart);
    renderCart();
  });

  $(document).on("click", ".btn-cart-remove", function () {
    var index = Number($(this).data("index"));
    var cart = ambilCart();
    if (cart[index]) cart.splice(index, 1);
    simpanCart(cart);
    renderCart();
    tampilkanToast("Barang dihapus dari keranjang.", "primary");
  });

  $("#btnClearCart").on("click", function () {
    simpanCart([]);
    renderCart();
    tampilkanToast("Keranjang dikosongkan.", "primary");
  });

  $("#btnCheckout").on("click", function () {
    var cart = ambilCart();
    if (cart.length === 0) {
      tampilkanToast("Keranjang masih kosong.", "warning");
      return;
    }

    var total = cart.reduce(function (sum, item) { return sum + item.qty * item.price; }, 0);
    var ringkasan = cart.map(function (item) { return item.name + " x" + item.qty; }).join(", ");
    var history = ambilHistory();

    history.unshift({
      kode: "TRX-" + new Date().getTime().toString().slice(-6),
      tanggal: new Date().toLocaleString("id-ID"),
      ringkasan: ringkasan,
      total: total
    });

    simpanHistory(history.slice(0, 8));
    simpanCart([]);
    renderCart();
    renderHistory();
    tampilkanToast("Checkout berhasil. Riwayat belanja tersimpan.", "success");
  });

  $("#btnClearHistory").on("click", function () {
    simpanHistory([]);
    renderHistory();
    tampilkanToast("Riwayat belanja dihapus.", "primary");
  });

  $("#btnDownloadReport").on("click", function () {
    tampilkanToast("Laporan siap diunduh.", "success");
  });

  $("#btnFilterReport").on("click", function () {
    tampilkanToast("Data laporan berhasil ditampilkan.", "primary");
  });

  refreshStatusStok();
  renderCart();
  renderHistory();
});
