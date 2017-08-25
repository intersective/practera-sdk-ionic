describe('AssessmentService without the TestBed', () => {
  let service: AssessmentService;

  beforeEach(() => { service = new AssessmentService(); });

  it('#getValue should return real value', () => {
    expect(1).toBe(1);
  });

});
