$(document).ready(function() {

    function Pozoviprekoajaxa(jsonlink, nazivfungcije) {
        $.ajax({
            url: jsonlink,
            type: "get",
            dataType: "json",
            success: function(podaci) {
                nazivfungcije(podaci);

            },
            error: function(xhr, error, status) { console.log(error) }

        });
    }

    Pozoviprekoajaxa("data/kategorije.json", IspisKategorija);

    function IspisKategorija(data) {
        let html = "";
        data.forEach(element => {
            html += `
        <button class="cat-btn">
        <input type="checkbox" value="${element.id}" class="cat-input-${element.naziv}" style="display:none;" />
        ${element.naziv}
        </button>`
        });

        if ($("#kategorije").length) {
            var Divfilters = $("#kategorije");
            Divfilters.append(html);
        }
        //dodavanje checked vrednost skribvenim checkbox-ovima i toggle active class-e dugmicima
        $(".cat-btn").click(function() {
            if ($(this).find("input").attr("checked") == "checked") {
                $(this).find("input").attr("checked", false);
                $(this).removeClass("active");
            } else {
                $(this).find("input").attr("checked", true);
                $(this).addClass("active");
            }
            ponovnipoziv();
        });
        $(".cat-btn-all").click(function() {
                $(".cat-btn").find("input").attr("checked", false);
                $(".cat-btn").removeClass("active");
                ponovnipoziv();
            })
            //pre-select prikaz itema
            // na osnovu klicka "Show" slika sa home strane
        let passed_name = localStorage.getItem("more_cat");
        if (passed_name) {
            let inputbox = $(".cat-input-" + passed_name);
            inputbox.attr("checked", true);
            ponovnipoziv();
            localStorage.removeItem("more_cat");
        }
    }
    Pozoviprekoajaxa("data/proizvodi.json", IspisProducta);

    function IspisProducta(param) {
        let div = document.getElementById('gallery');
        if (div != null) {
            param = Filtercat(param);
            param = pretraga(param);
            param = SortiranjepoCeni(param);
        }
        let html = "";
        param.forEach(e => {
            html += ` <div class="col-lg-3 col-md-6 special-grid">
                        <div class="products-single fix">
                            <div class="box-img-hover">
                                <div class="type-lb">
                                    <p class="sale">${e.snizenje?"Sale":""}</p>
                                </div>
                                <img src="images/gallery/${e.slika.src}.jpg" class="img-fluid" alt="${e.slika.alt}">
                                <div class="mask-icon">
                                    <b>${e.naziv}</b>
                                    <ul>
                                        <li><a href="#" data-toggle="tooltip" class="btn-view" data-id="${e.id}" data-placement="right" title="View"><i class="fas fa-eye"></i></a></li>
                                        <li><a href="#" data-toggle="tooltip" class="btn-cart" data-id="${e.id}" data-placement="right" title="Add to Cart"><i class="fas fa-shopping-cart"></i></a></li>
                                     </ul>
                                    <a class="cart"><p>$${e.cena.nova}</p></a>

                                </div>
                            </div>
                        </div>
                    </div>  `
        });

        if (div != null) {
            div.innerHTML = html;
        }
        filterTopsell(param);
        shop_detail(param);
        cartlist(param);
    }
    Pozoviprekoajaxa("data/meni.json", Meni);

    function Meni(data) {
        let html = "";
        data.forEach(ele => {
            html += `<li class="add-after"><a href="${ele.url}">${ele.naziv}</a></li>`
        });
        // console.log(html)
        if ($("#meni").length) {
            $("#meni").prepend(html);

        }
        $("#mobile-menu").prepend(html);
    }
    Pozoviprekoajaxa("data/img-cat.json", Imgcat);

    function Imgcat(param) {

        let html = "";
        param.forEach(e => {
            html += ` <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <div class="shop-cat-box">
                <img class="img-fluid" src="images/gallery/${e.slika.src}.jpg" alt="${e.slika.alt}" />
                <a class="btn hvr-hover more-cat" data-name="${e.naziv}" href="#">Show ${e.naziv}</a>
            </div>
        </div>`

        });
        if ($("#img-cat").length) {
            var Div = $("#img-cat");
            Div.prepend(html);
        }
        dirrect_cat();
    }
    //skladistenje odabira "Show" itema sa home strane i redirekcija na products
    function dirrect_cat() {
        $(".more-cat").click(function(e) {
            e.preventDefault();
            let name = $(this).data("name");
            console.log(name);

            localStorage.setItem("more_cat", name);
            window.location.href = "products.html#product-box";
        })

    }
    Pozoviprekoajaxa("data/blogs.json", Blogs);

    function Blogs(param) {

        let html = "";
        param.forEach(e => {
            html += ` <div class="col-md-6 col-lg-4 col-xl-4">
            <div class="blog-box">
                <div class="blog-img">
                   <a href="#" data-id="${e.id}" class="blog-view">
                   <img class="img-fluid" src="images/blog/${e.slika.src}.jpg" alt="${e.slika.alt}" /></a> 
                </div>
                <div class="blog-content">
                    <div class="title-blog">
                        <h3>${e.naziv}</h3>
                        <p>${e.opis.slice(0, 200)}...</p></div>
                   
                </div>
            </div>
        </div>`
        });

        if ($("#blogs").length) {
            $("#blogs").prepend(html);
        }
        blog_detail(param);

    }

    //topsell-filter
    function filterTopsell(data) {
        let sellniz = data.filter(function(item) {
            if (item.top_seller) {
                return item;
            }
        });
        filtersellers(sellniz);
        TopSellers(sellniz);
        view_options(sellniz);
        TopSellers_list(sellniz);
    }

    function TopSellers(param) {
        let html = "";
        param.forEach(e => {
            html += `  <div class="top-sell-grid col-lg-4 col-md-6 special-grid best-seller">
            <div class="products-single fix">
                <div class="box-img-hover">
                <div class="type-lb">
                     <p class="sale">
                   ${Popularnost(e.popularnost)}
                    </p>
                </div>
                    <img src="images/gallery/${e.slika.src}.jpg" class="img-fluid" alt="${e.slika.alt}">
                    <div class="mask-icon">
                    <ul>
                    <li><a href="#" data-toggle="tooltip" class="btn-view" data-id="${e.id}" data-placement="right" title="View"><i class="fas fa-eye"></i></a></li>
                    <li><a href="#" data-toggle="tooltip" class="btn-cart" data-id="${e.id}" data-placement="right" title="Add to Cart"><i class="fas fa-shopping-cart"></i></a></li>
                 </ul>
                        <a class="cart" href="#"><p>$${e.cena.nova}</p> <p>${e.naziv}</p></a>
                    </div>
                </div>
               
            </div>
        </div> `

        });
        //  console.log(html)

        let div = document.getElementById('top-seller');
        if (div != null) {
            div.innerHTML = html;
        }
    }
    //prikaz top-sell-itema u opsirnijem obliku
    function TopSellers_list(param) {
        let html = "";
        param.forEach(e => {
            html += `  <div class="list-view-box">
                                 <div class="row">
                                        <div class="col-sm-6 col-md-6 col-lg-4 col-xl-4">
                                            <div class="products-single fix">
                                                <div class="box-img-hover">
                                                <div class="type-lb">
                                                <p class="sale">
                                              ${Popularnost(e.popularnost)}
                                               </p>
                                           </div>
                                                    <img src="images/gallery/${e.slika.src}.jpg" class="img-fluid" alt="${e.slika.alt}">
                                                        <div class="mask-icon">
                                                        <ul>
                                                        <li><a href="#" data-toggle="tooltip" class="btn-view" data-id="${e.id}" data-placement="right" title="View"><i class="fas fa-eye"></i></a></li>
                                                        <li><a href="#" data-toggle="tooltip" class="btn-cart"
                                                         data-id="${e.id}" data-placement="right" title="Add to Cart">
                                                         <i class="fas fa-shopping-cart"></i></a></li>
                                                    </ul>
                                                        </div>
                                                </div>
                                            </div>
                                        </div>
                                    <div class="col-sm-6 col-md-6 col-lg-8 col-xl-8">
                                        <div class="why-text full-width">
                                            <h4>${e.naziv}</h4>
                                            <h5> <del>$ ${e.cena.stara}</del> $ ${e.cena.nova}</h5>
                                            <p> ${e.opis}</p> <a class="btn hvr-hover" class="btn-cart"
                                             data-id="${e.id}" href="#">Add to Cart</a>
                                        </div>
                                    </div>
                                </div>
                            </div> `

        });
        //console.log(html)

        let div = document.getElementById('top-seller-list');
        if (div != null) {
            div.innerHTML = html;
        }
    }

    //filter po kategorijama-top-sellers
    function filtersellers(data) {
        $(".top-sell").click(function(e) {
            $(".top-sell").removeClass("active");
            $(this).addClass("active");
            e.preventDefault();
            let sellid = $(this).val();
            let noviniz = data.filter(function(item) {
                for (const pid of item.popularnost) {
                    if (sellid == pid) {
                        return item;
                    }
                }
            })
            if (noviniz.length) {
                TopSellers(noviniz);
                TopSellers_list(noviniz);
            } else {
                TopSellers(data);
                TopSellers_list(data);

            }
            if (sellid == "*") {
                $(".top-sell").removeClass('active');
                $(this).addClass("active");
                TopSellers(data);
                TopSellers_list(data);


            }

        })

    }
    //grid-list view eventi
    $('#top-seller-list').hide();

    function view_options() {
        $(".view-op").click(function(e) {
            $(".view-op").removeClass("active");
            $(this).addClass("active");
            e.preventDefault();
            let value = $(this).val();
            if (value == 0) {
                $('#top-seller-list').hide();
                $('#top-seller').show();

            } else {
                $('#top-seller').hide();
                $('#top-seller-list').show();
            }

        })

    }

    //prikaz popularnosti na osnovu products
    function Popularnost(ids) {
        let popniz = [{
                "id": 0,
                "naziv": "TOP"
            },
            {
                "id": 1,
                "naziv": "BEST"
            }
        ]
        let html = "";
        let responce = popniz.filter(e => ids.includes(e.id));
        responce.forEach((e, i) => {
            html += e.naziv;
            if (i != responce.length - 1) {
                html += ', ';
            }
        });
        return html;
    }
    // dropdorwn toogle
    $(".toggle-menu").hide();
    $(".sub-menu-btn").click(function(e) {
        e.preventDefault();
        $(".toggle-menu").toggle();
    });
    //filter po kategorijama
    function Filtercat(data) {
        let selectedids = [];
        $('.cat-btn').find('input[type="checkbox"]:checked').each(function() {
            selectedids.push(parseInt($(this).val()));
        })
        if (selectedids.length != 0) {
            return data.filter(i => selectedids.includes(i.kategorija));
        }
        return data;
    }
    //search-bar
    $("#search-bar").keyup(ponovnipoziv);

    function pretraga(data) {
        let value = $("#search-bar").val().toLowerCase();

        if (value) {
            return data.filter(function(item) {
                return item.naziv.toLowerCase().indexOf(value) !== -1;
            })
        }
        // console.log(responce)
        return data;

    }
    //sortiranje po ceni
    $("#price-sort").change(ponovnipoziv);

    function SortiranjepoCeni(data) {
        var id = $("#price-sort").val();
        ///  console.log(id)
        if (id == "asc") {
            return data.sort((a, b) => parseFloat(a.cena.nova) > parseFloat(b.cena.nova) ? 1 : -1);
        }
        if (id == "desc") { return data.sort((a, b) => parseFloat(a.cena.nova) < parseFloat(b.cena.nova) ? 1 : -1); }
        if (id == "0-20") {
            return data.filter(e => (parseFloat(e.cena.nova)) < 20);
        }
        if (id == "0-50") {
            return data.filter(e => (parseFloat(e.cena.nova)) < 50);
        }
        if (id == "*") {
            return data;
        }
    }

    function ponovnipoziv() {
        Pozoviprekoajaxa("data/proizvodi.json", IspisProducta);
    }
    //Ispis lokacija na istoj strani preko localstorage
    Pozoviprekoajaxa("data/location.json", lokacija);

    function lokacija(data) {
        $(".loc-press").click(function(e) {
            e.preventDefault();
            var loc_id = $(this).data("id");
            // console.log(loc_id);
            let responce;
            responce = data.filter(b => b.id == loc_id);
            if (responce.length != 0) {
                localStorage.setItem("location_data", JSON.stringify(responce));
                window.location.href = "location.html";
            }
        })

        let location_data = localStorage.getItem("location_data");
        let par = JSON.parse(location_data);
        IspisLokacije(par);
        localStorage.removeItem("location_data");
    }

    function IspisLokacije(data) {
        let ispis = "";
        let html = "";
        let title = "";
        if (data) {
            data.forEach(e => {
                ispis += `  
                <h2 class="h1">Hours &amp; Location</h2>
                <p>
                    ${e.adresa.ulica},<br> ${e.adresa.grad}, ${e.adresa.postanskibroj} <br>
                    <a href="tel:${e.telefon}" data-bb-track="button" data-bb-track-on="click"
                     data-bb-track-category="Phone Number" data-bb-track-action="Click" 
                     data-bb-track-label="Location">${e.telefon}</a><br>
                    <a href="mailto:${e.email}">${e.email}</a></p>
                <p>BRUNCH DAILY</p>
                <p>${e.radnisati}</p>`
                html += ` 
                <div class="loc-intro col-lg-12 d-flex justify-content-center align-content-center" style="background: url(images/banner/${e.slika}) ;background-repeat: no-repeat;background-position: center; background-size: cover;">
                    <div class=" text-center">
                    <h2>${e.naziv}</h2>
                    <p>${e.opis}</p>
                    </div>
                  </div>
                `
                title += `<h2>${e.naziv}</h2>
                <ul class="breadcrumb">
                            <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                            <li class="breadcrumb-item active"> LOCATIONS & HOURS </li>
                        </ul>`
            });

        }
        $(".loc-info").html(ispis);
        $(".loc-content").html(html);
        $(".loc-title").html(title);
    }
    //ispis product-details info sa localstorage


    function shop_detail(data) {
        $(".btn-view").click(function(e) {
            e.preventDefault();
            var loc_id = $(this).data("id");
            console.log(loc_id);
            let responce;
            responce = data.filter(b => b.id == loc_id);
            console.log(responce)
            if (responce.length != 0) {
                localStorage.setItem("shop_detail", JSON.stringify(responce));
                window.location.href = "shop-detail.html";
            }
        })
        let datail_data = localStorage.getItem("shop_detail");
        let par = JSON.parse(datail_data);
        IspisDetail(par);
        localStorage.removeItem("shop_detail");


    }

    function IspisDetail(data) {
        let html = "";
        if (data) {
            data.forEach(e => {
                html += `<div class="col-xl-5 col-lg-5 col-md-6">
            <img class="img-fluid" src="images/gallery/${e.slika.src}.jpg" alt="${e.slika.alt}" />
        </div>
        <div class="col-xl-7 col-lg-7 col-md-6">
            <div class="single-product-details">
                <h2>${e.naziv}</h2>
                <p>kategorija</p>
                <h5> <del>$ ${e.cena.stara}</del> $${e.cena.nova}</h5>
                <p class="available-stock"><span> More than ${String(e.na_raspolaganju)} available / <a href="#">${String(e.broj_prodatih)} sold </a></span>
                    <p>
                        <h4>Short Description:</h4>
                        <p>${e.opis}</p>

            </div>
        </div>`
            });
            $("#shop-detail").html(html);
        }

    }
    //cartlist
    function postavikolacic(name, value, days) {
        let datum = new Date();
        datum.setTime(datum.getTime() + (days * 24 * 60 * 60 * 1000));
        let expires = "expires=" + datum.toUTCString();
        document.cookie = name + "=" + value + ";" + expires;
    }


    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function cartlist(data) {

        $(".btn-cart").on("click", function(e) {
                e.preventDefault();
                alert('You have placed an item in the selection. You can see more on cart page.');
                var id = $(this).data('id');
                // console.log(id)
                let item = data.filter(e => e.id == id);
                // img/gallery/nesto
                let item_id, slikaalt, slikaurl, naziv, cena, na_raspolaganju;
                item.forEach(e => {
                    item_id = e.id;
                    slikaurl = e.slika.src;
                    slikaalt = e.slika.alt;
                    naziv = e.naziv;
                    cena = e.cena.nova;
                    na_raspolaganju = e.na_raspolaganju;
                    total = e.cena.nova;
                });

                let cart = [];
                let booking = getCookie("cart");
                //  console.log(booking);
                if (booking) {
                    cart = JSON.parse(booking);
                }
                //  console.log(cart);
                if (cart.some(x => x.naziv == naziv)) {
                    var found = cart.find(x => x.naziv == naziv)
                    found.kolicina++;
                    found.total = found.cena * found.kolicina;

                } else {
                    cart.push({ item_id, slikaalt, slikaurl, naziv, cena, na_raspolaganju, kolicina: 1, total });
                }
                postavikolacic("cart", JSON.stringify(cart), 4);

            }) //event
    } //cart list break
    upisikolacic();

    function upisikolacic() {
        const booking = getCookie("cart");
        if (booking) {
            var cookie = JSON.parse(booking);
            // console.log(cookie);
            let html = '';
            cookie.forEach(e => {
                html += `<tr>
                    <td class="thumbnail-img">
                        <a href="#">
                            <img class="img-fluid" src="images/gallery/${e.slikaurl}.jpg" alt="${e.slikaalt}" />
                        </a>
                    </td>
                    <td class="name-pr">
                        <a href="#">
               ${e.naziv}
            </a>
                    </td>
                    <td class="price-pr">
                        <p>$${e.cena}</p>
                    </td>
                    <td class="quantity-box">
                    <input name="qty" type="text" size="4" min="0" step="1" 
                     value="${e.kolicina}" class="c-input-text qty text qtyinput${e.item_id}">
                    <a href="#" class="quantity-arrow"data-id="${e.item_id}" data-aro="up"><i class="fas fa-arrow-up" ></i></a>
                    <a  href="#" class="quantity-arrow"data-id="${e.item_id}" data-aro="down"><i class="fas fa-arrow-down" ></i></a>
                     
                     </td>
                    <td class="total-pr">
                        <p>$${parseFloat(e.total).toFixed(2)}</p>
                    </td>
                    <td class="remove-pr">
                        <a href="#" class="btn-remove-item" data-id="${e.item_id}">
                            <i class="fas fa-times"></i>
                        </a>
                    </td>
                </tr>`

            });
            $("#cart-list").html(html);

            $('.btn-remove-item').click(deleteFromList);
            $('.btn-clear-list').click(deleteCart);
            $('.quantity-arrow').click(qtyonclick);
        } //if(booking)
        else {
            ispis = "";
            ispis = "<td><h5>Your list is empty.</h5></td>"
            $("#cart-list").html(ispis);

        }
        subtotal();
    } //upiskolacic

    function deleteFromList() {
        const delid = $(this).data("id");
        // console.log(delid);
        const booking = getCookie("cart");
        if (booking) {
            var cookie = JSON.parse(booking);
            const filtered = cookie.filter(item => item.item_id != delid);
            // console.log(filtered);

            if (filtered.length == 0) {
                deleteCart();
            } else {
                postavikolacic("cart", JSON.stringify(filtered), 5);
            }

            upisikolacic();
        }
    }

    function deleteCart() {
        postavikolacic("cart", null, -1);
        upisikolacic();
    }
    //povecanje kolicine na click u cartu
    function qtyonclick(e) {
        e.preventDefault();
        let id = $(this).data("id");
        let item = $(".qtyinput" + id);
        let qty = item.val();
        let arrow = $(this).data("aro");
        // console.log(item);
        // console.log(qty);
        // console.log(id);
        const booking = getCookie("cart");
        if (booking) {
            var cookie = JSON.parse(booking);
            let filtered = [];
            filtered = cookie.filter(item => item.item_id != id);

            let found = cookie.find(x => x.item_id == id);
            if (arrow == "up") {
                found.kolicina++;
                qty++;
            } else {
                found.kolicina--;
                qty--;
            }
            found.total = found.cena * qty;
            filtered.push(found);
            postavikolacic("cart", JSON.stringify(filtered), 5);

            upisikolacic();

        }
    }
    //subtotal
    function subtotal() {
        const booking = getCookie("cart");
        if (booking) {
            var cookie = JSON.parse(booking);
            var sub = 0;
            cookie.forEach(element => {
                sub += parseFloat(element.total);
            });
            $('#sub-total').html(parseFloat(sub).toFixed(2))
                // console.log(typeof html)
            var grand = sub + 10 + 2
            $("#grand-total").html(parseFloat(grand).toFixed(2))

        }
    }

    coutispis();

    function coutispis() {
        const booking = getCookie("cart");
        if (booking) {
            let cout = "";
            var cookie = JSON.parse(booking);
            //  console.log(cookie)
            cookie.forEach(e => {
                cout += `<div class="media mb-2 border-bottom">
                    <div class="media-body"> <a href="detail.html">${e.naziv}</a>
                        <div class="small text-muted">Price: $${e.cena} <span class="mx-2">|</span> Qty:
                         ${e.kolicina} <span class="mx-2">|</span> Total: $${e.total}</div>
                    </div>
                </div>`
            });
            // console.log(cout)
            $('#cout-cart').html(cout);

        } else {
            ispis = "";
            ispis = "<td><h5>Your list is empty.</h5></td>"
            $('#cout-cart').html(ispis);

        }
    }
    //blogs

    function blog_detail(data) {
        $('.blog-view').click(function(e) {

            e.preventDefault();
            var loc_id = $(this).data("id");
            console.log(loc_id);
            let responce;
            responce = data.filter(b => b.id == loc_id);
            //console.log(responce)
            if (responce.length != 0) {
                localStorage.setItem("blog_detail", JSON.stringify(responce));
                window.location.href = "blog-detail.html";
            }
        })
        let blog_data = localStorage.getItem("blog_detail");
        let par = JSON.parse(blog_data);

        let html = "";
        if (par != null) {
            par.forEach(e => {
                html += `<div class="col-xl-5 col-lg-5 col-md-6">
                            <img class="img-fluid" src="images/blog/${e.slika.src}.jpg" alt="${e.slika.alt}" />
                        </div>
                        <div class="col-xl-7 col-lg-7 col-md-6">
                            <div class="single-product-details">
                                <h2>${e.naziv}</h2>
                                <h5></h5>
                                        <h4>Whole Description:</h4>
                                        <p>${e.opis}</p>
                            </div>
                        </div>`

            });
            if ($("#blog-detail").length) {
                $("#blog-detail").html(html);
            }
        }
        localStorage.removeItem("blog_detail");

    }

    //Provera podataka forme
    //still not in use


    checkout_forma();

    function checkout_forma() {
        if ($("#checkout").length) {
            let fname = $('#firstName');
            let lname = $('#lastName');
            let email = $('#email');
            let address = $('#address');
            let country = $('#country');
            let city = $('#city');
            let zip = $('#zip');
            let countryniz = [{
                    "id": 0,
                    "name": "Serbia"
                },
                {
                    "id": 1,
                    "name": "Germany"
                }, {
                    "id": 2,
                    "name": "France"
                }, {
                    "id": 3,
                    "name": "United States"
                },
            ];
            let cityniz = [{
                    "id": 0,
                    "name": "Belgrade",
                    "country": 0
                },
                {
                    "id": 1,
                    "name": "Nis",
                    "country": 0
                },
                {
                    "id": 2,
                    "name": "Paris",
                    "country": 2
                },
                {
                    "id": 3,
                    "name": "Marsej",
                    "country": 2
                },
                {
                    "id": 4,
                    "name": "Berlin",
                    "country": 1
                },
                {
                    "id": 5,
                    "name": "Lajpcig",
                    "country": 1
                },
                {
                    "id": 6,
                    "name": "Texas",
                    "country": 3
                },
                {
                    "id": 7,
                    "name": "Yutah",
                    "country": 3
                }

            ];
            ispisdrzave(countryniz);

            function ispisdrzave(data) {
                let ctn = "";
                ctn += `<option value="Choose...">Choose...</option>`
                data.forEach(element => {
                    ctn += `<option id="${element.id}" value="${element.name}">${element.name}</option>`
                });
                $('#country').html(ctn);
            }
            let responce_citys;
            $('#country').change(function() {
                let country_id = $(this).find('option:selected').attr('id')
                    //console.log(country_id);
                responce_citys = cityniz.filter(b => b.country == country_id);
                if (responce_citys) {
                    ispisgrad(responce_citys)
                } else {
                    ispisgrad(cityniz)

                }
            });
            ispisgrad(cityniz);

            function ispisgrad(par) {
                let city = "";
                city += `<option value="Choose..." >Choose...</option>`

                par.forEach(element => {
                    city += `<option  value="${element.name}">${element.name}</option>`
                });
                $('#city').html(city);
            }
            ///change subtotal bassed on the shhiping input  
            $('.shipping').change(function() {
                    let grand;
                    let shipping = $('.shipping:checked').next("label").text();
                    const booking = getCookie("cart");
                    if (booking) {
                        var cookie = JSON.parse(booking);
                        var sub = 0;
                        cookie.forEach(element => {
                            sub += parseFloat(element.total);
                        });

                        if (shipping == "Express Delivery") {
                            sub += 10;
                        } else if (shipping == "Next Business day") {
                            sub += 20;
                        }
                        //  console.log(sub);
                        $('#sub-total').append(parseFloat(sub).toFixed(2))
                            // console.log(typeof html)
                        grand = sub + 10 + 2
                        $("#grand-total").append(parseFloat(grand).toFixed(2))

                    }

                })
                //provera forme
            let podaciForme = [];
            $('.checkout-btn').click(function(e) {
                e.preventDefault();
                let shipping = $('.shipping:checked').next("label").text();

                let fname_lnameRe = /^\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/; //Marthin Luther King, Jr.
                let emailRe = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; //test@gmail.edu.com
                let addressRe = /^\s*\S+(?:\s+\S+){2}/; // (253 N. Cherry St. )
                let zipRe = /^[0-9]{5}(?:-[0-9]{4})?$/; //12345
                let spremno = true;

                function Proveriparametar(parametar, regex, primer) {
                    if (parametar.val() == '') {
                        spremno = false;
                        parametar.val("");
                        parametar.next().text('The field can not be empty.');
                    } else if (!regex.test(parametar.val())) {
                        spremno = false;
                        parametar.val("");
                        parametar.next().text('Eg:' + primer);
                    } else {
                        podaciForme.push(parametar.val());
                        parametar.next().text('');
                    }
                } //proveri

                Proveriparametar(fname, fname_lnameRe, "Abraham");
                Proveriparametar(lname, fname_lnameRe, "Luther King, Jr.");
                Proveriparametar(email, emailRe, "test@gmail.edu.com");
                Proveriparametar(address, addressRe, "(253 N. Cherry St. )");
                Proveriparametar(zip, zipRe, "Zip code must be 5 digits (12345)");

                //country 
                if (country.val() == "Choose...") {
                    spremno = false;
                    country.next().text('You have to select a Country.');
                } else {
                    podaciForme.push(country.val());
                    country.next().text('');
                }
                //grad
                if (city.val() == "Choose...") {
                    spremno = false;
                    city.next().text('You have to select a city.');
                } else {
                    podaciForme.push(city.val());
                    city.next().text('');
                }
                //
                let grand_val = $("#grand-total").text();

                if (grand_val == " ") {
                    spremno = false;
                    $(".empty-cart").text("Your cart is empty!");
                }

                if (spremno) {
                    let msg = "";
                    msg += `<h1>Order-list</h1>
                    <p>Your order has been placed! You will get your items throgh our delvery personel and contacted at the arival. Thank you for your sevice.</p>
                    `
                    $("#order-msg").html(msg);

                    let order = "";
                    order += `
                    <div class="d-flex">
                    <h4>Name</h4>
                    <div class="ml-auto font-weight-bold">${fname.val()+lname.val()} </div>
                </div>
                <div class="d-flex">
                    <h4>Email</h4>
                    <div class="ml-auto font-weight-bold">${email.val()} </div>
                </div>
                <hr class="my-1">
                <div class="d-flex">
                    <h4>Address</h4>
                    <div class="ml-auto font-weight-bold">${address.val()} </div>
                </div>
                <div class="d-flex">
                    <h4>Country/City</h4>
                    <div class="ml-auto font-weight-bold">${country.val()+"/ "+city.val()+"/ "+zip.val()}</div>
                </div>
                <hr>
                <div class="d-flex gr-total">
                    <h5>Shipping method</h5>
                    <div class="ml-auto h5" id="grand-total"> ${shipping} </div>
                </div>
                <div class="d-flex gr-total">
                <h5>Grand total</h5>
                <div class="ml-auto h5" id="grand-total"> ${grand_val} </div>
            </div>
                <hr> 
                    `
                    $("#order-view").html(order);


                }

            });
        }

    } //forma
    contact_forma();

    function contact_forma() {
        if ($("#contactForm").length) {
            let name = $('#name');
            let email = $('#email');
            let subject = $('#subject');
            let msg = $('#message');
            $("#send-msg").click(function(e) {
                e.preventDefault();
                let podaci = [];
                let fname_lnameRe = /^\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/; //Marthin Luther King, Jr.
                let emailRe = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; //test@gmail.edu.com
                let spremno = true;

                if (name.val() == '') {
                    spremno = false;
                    name.val("");
                    name.next().text('The field can not be empty.');
                } else if (!fname_lnameRe.test(name.val())) {
                    spremno = false;
                    name.val("");
                    name.next().text("Example: Marthin Luther King, Jr.");
                } else {
                    podaci.push(name.val());
                    name.next().text('');
                }
                //
                if (email.val() == '') {
                    spremno = false;
                    email.val("");
                    email.next().text('The field can not be empty.');
                } else if (!emailRe.test(email.val())) {
                    spremno = false;
                    email.val("");
                    email.next().text(" Example: test@gmail.edu.com");
                } else {
                    podaci.push(email.val());
                    email.next().text('');
                }
                //

                if (subject.val() == '') {
                    spremno = false;
                    subject.val("");
                    subject.next().text('The field can not be empty.');
                } else if (subject.val().length < 3) {
                    spremno = false;
                    subject.val("");
                    subject.next().text('The Message title shoud be something more then three characters.');

                } else if (subject.val().charAt(0) != subject.val().charAt(0).toUpperCase()) {
                    spremno = false;
                    subject.val("");
                    subject.next().text('First letter should be bigger.');

                } else {
                    podaci.push(subject.val());
                    subject.next().text('');
                }
                //

                if (msg.val() == '') {
                    spremno = false;
                    msg.val("");
                    msg.next().text('The field can not be empty.');
                } else if (msg.val().length < 10) {
                    spremno = false;
                    msg.val("");
                    msg.next().text('You need to write something more then ten characters.');

                } else {
                    podaci.push(msg.val());
                    msg.next().text('');
                }
                if (spremno) {
                    console.log(podaci);
                    $("#msgSubmit").html("<p>Your message has been sent!</p>");
                }

            })



        }
    }


})