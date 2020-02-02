import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CartItemEntity, CartService, LineItem, OrderEntity, ValidationHelper} from '../../../_core';
import {ShopRepository, RepositoryMocks} from '../../../_data';

@Component({
  selector: 'app-checkout-page',
  styleUrls: ['./checkout-page.component.scss'],
  templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit {
  /// fields
  public projectFormGroup: FormGroup;
  public billingFormGroup: FormGroup;
  public currentDate: Date = new Date();

  public order: OrderEntity = new OrderEntity();

  /// predicates
  public orderCompleted = false;
  public orderNumber = 'ON-34412';

  /// spinners
  public isLoading = false;

  /// helper
  public validationHelper = ValidationHelper;

  /// constructor
  constructor(private _formBuilder: FormBuilder,
              private shopRepository: ShopRepository,
              private cartService: CartService,
              private router: Router) {
    this.order = RepositoryMocks.Order();
  }

  ngOnInit() {
    if (this.cartService.itemsCount === 0) {
      this.router.navigate([`/cart`]);
    }

    // this.projectFormGroup = new FormGroup({
    //   requestedBy: new FormControl('', [
    //     Validators.required,
    //   ])
    // });

    this.projectFormGroup = this._formBuilder.group({
      requestedBy: ['', Validators.required],
      projectName: ['', Validators.required],
      projectNumber: ['', Validators.required],

      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    });

    this.billingFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  /// methods
  public placeOrder(order: OrderEntity) {
    this.isLoading = true;

    for (const item of this.cartService.getItems) {
      order.lineItems.push(new LineItem({
        productId: item.id,
        quantity: item.count
      }));
    }

    this.shopRepository.placeOrder(order).subscribe((data: any) => {
      this.isLoading = false;
      this.orderCompleted = true;
      this.cartService.clearCart();
    });
  }
}

export class ProjectInfo {
  requestedBy: string;
  projectName: string;
  projectNumber: string;

  address: string;
  city: string;
  state: string;
  zip: string;
}

export class ConfirmBilling {
  fullName: string;
  projectName: string;
  projectNumber: string;
}
