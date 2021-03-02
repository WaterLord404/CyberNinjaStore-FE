import { animate, style, transition, trigger } from '@angular/animations';
import { Byte } from '@angular/compiler/src/util';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/core/services/document.service';
import { ProductI } from '../../Interfaces/productI';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('500ms ease-in', style({ opacity: '1' })),
      ]),
    ]),
  ],
})
export class ProductsComponent implements OnInit {

  products: Array<ProductI>;
  @Output() locationEvent = new EventEmitter<string>();

  constructor(
    private productService: ProductService,
    private router: Router,
    protected documentService: DocumentService
  ) { }

  /**
   * Carga todos los productos
   */
  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      res => {
        this.products = res;
        this.locationEvent.emit('Products');
      },
      () => this.router.navigate(['not-found'])
    );
  }

  /**
   * Redirige a el item especificado y envia el objeto para una carga mas rapida
   * @param product
   */
  navigateToProduct(item: ProductI): void {
    this.router.navigate(['products/' + item.id], { state: { item } });
  }
}
