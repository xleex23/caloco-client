import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HomeCounterComponent } from './home-counter.component';
import { HomeServiceService } from 'src/app/services/home-service.service';

class MockHomeService {
  getData = jasmine.createSpy('getData').and.returnValue(of([]));
  createNew = jasmine.createSpy('createNew').and.returnValue(of({ id: 1 }));
  updateItem = jasmine.createSpy('updateItem').and.returnValue(of({ id: 1 }));
}

describe('HomeCounterComponent', () => {
  let component: HomeCounterComponent;
  let fixture: ComponentFixture<HomeCounterComponent>;
  let mockHomeService: MockHomeService;

  beforeEach(async () => {
    mockHomeService = new MockHomeService();

    await TestBed.configureTestingModule({
      declarations: [HomeCounterComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: HomeServiceService, useValue: mockHomeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const form = component.someForm;
    expect(form).toBeTruthy();
    expect(form.controls.name.value).toBe('');
    expect(form.controls.email.value).toBe('');
    expect(form.controls.phoneNumber.value).toBe('');
    expect(form.controls.studentId.value).toBe('');
    expect(form.controls.password.value).toBe('');
    expect(form.controls.birthdate.value).toBeTruthy();
  });

  it('should validate the form controls', () => {
    const form = component.someForm;

    form.controls.name.setValue('A');
    expect(form.controls.name.invalid).toBeTrue();

    form.controls.email.setValue('invalid-email');
    expect(form.controls.email.invalid).toBeTrue();

    form.controls.phoneNumber.setValue('123');
    expect(form.controls.phoneNumber.invalid).toBeTrue();

    form.controls.studentId.setValue('abc');
    expect(form.controls.studentId.invalid).toBeTrue();

    form.controls.password.setValue('weakpass');
    expect(form.controls.password.invalid).toBeTrue();

    form.controls.birthdate.setValue('2020-01-01');
    expect(form.controls.birthdate.invalid).toBeTrue();
  });

  it('should fetch data and populate the data array', () => {
    mockHomeService.getData.and.returnValue(of([{ id: 1 }]));
    component.fetchData();

    expect(mockHomeService.getData).toHaveBeenCalled();
    expect(component.dataItems).toEqual([{ id: 1 }]);
  });

  it('should handle fetchData error correctly', () => {
    mockHomeService.getData.and.returnValue(throwError(() => new Error('Error fetching data')));
    component.fetchData();

    expect(mockHomeService.getData).toHaveBeenCalled();
    expect(component.errorMsg).toBe('Error fetching data');
  });

  it('should create a new item and reset the form', () => {
    component.someForm.setValue({
      name: 'John',
      email: 'john@example.com',
      phoneNumber: '+1234567890',
      studentId: '1234',
      password: 'StrongPass1!',
      birthdate: '2000-01-01',
    });
    component.createItem();

    expect(mockHomeService.createNew).toHaveBeenCalledWith(component.someForm.value);
    expect(component.dataItems).toEqual([{ id: 1 }]);
    expect(component.someForm.pristine).toBeTrue();
  });

  it('should update an item and reset the form', () => {
    // Mock the initial data to simulate an existing item in the service
    const initialData = [{ id: 1, name: 'Old Name' }];
    mockHomeService.getData.and.returnValue(of(initialData));
    component.fetchData(); // This populates the data array via the service
    
    // Update the form with new data
    component.someForm.setValue({
      name: 'Updated Name',
      email: 'updated@example.com',
      phoneNumber: '+1234567890',
      studentId: '1234',
      password: 'StrongPass1!',
      birthdate: '2000-01-01',
    });
  
    // Simulate updating the item
    const updatedItem = { id: 1, name: 'Updated Name' };
    mockHomeService.updateItem.and.returnValue(of(updatedItem));
    component.updateItem();
  
    // Verify the service call
    expect(mockHomeService.updateItem).toHaveBeenCalledWith(component.someForm.value);
  
    // Verify that the data was updated via the getter
    expect(component.dataItems.find(item => item.id === 1)?.name).toBe('Updated Name');
  
    // Verify the form was reset
    expect(component.someForm.pristine).toBeTrue();
  });
  

  it('should submit the form if valid', () => {
    component.someForm.setValue({
      name: 'John',
      email: 'john@example.com',
      phoneNumber: '+1234567890',
      studentId: '1234',
      password: 'StrongPass1!',
      birthdate: '2000-01-01',
    });
    component.submitForm();

    expect(component.isSubmitted).toBeTrue();
    expect(component.dataItems).toEqual(component.someForm.value);
  });

  it('should not submit the form if invalid', () => {
    component.someForm.setValue({
      name: '',
      email: '',
      phoneNumber: '',
      studentId: '',
      password: '',
      birthdate: '',
    });
    component.submitForm();

    expect(component.isSubmitted).toBeFalse();
    expect(component.someForm.touched).toBeTrue();
  });
});
