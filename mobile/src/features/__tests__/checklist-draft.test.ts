import { useChecklistDraft } from '@/store/checklist-draft';

const VISIT = 'visit-1';

describe('offline report draft', () => {
  beforeEach(() => {
    useChecklistDraft.setState({ drafts: {} });
  });

  it('starts empty for an unknown visit', () => {
    const draft = useChecklistDraft.getState().getDraft(VISIT);
    expect(draft.observations).toEqual({});
    expect(draft.listing_match).toBeNull();
    expect(draft.pending_photos).toEqual([]);
  });

  it('keeps a note when only the rating is updated afterwards', () => {
    // The verifier types a note, then taps a rating. Losing the note at that
    // point is exactly the bug this store exists to prevent.
    const store = useChecklistDraft.getState();
    store.setObservation(VISIT, 'visible_damp', { note: 'Patch above the window.' });
    store.setObservation(VISIT, 'visible_damp', { rating: 'concern' });

    const draft = useChecklistDraft.getState().drafts[VISIT]!;
    expect(draft.observations.visible_damp).toEqual({
      rating: 'concern',
      note: 'Patch above the window.',
    });
  });

  it('keeps a rating when only the note is updated afterwards', () => {
    const store = useChecklistDraft.getState();
    store.setObservation(VISIT, 'kitchen', { rating: 'good' });
    store.setObservation(VISIT, 'kitchen', { note: 'Recently refitted.' });

    expect(useChecklistDraft.getState().drafts[VISIT]!.observations.kitchen).toEqual({
      rating: 'good',
      note: 'Recently refitted.',
    });
  });

  it('queues photos and removes them once uploaded', () => {
    const store = useChecklistDraft.getState();
    store.queuePhoto(VISIT, 'file:///a.jpg', '');
    store.queuePhoto(VISIT, 'file:///b.jpg', 'Bathroom');
    expect(useChecklistDraft.getState().drafts[VISIT]!.pending_photos).toHaveLength(2);

    store.dequeuePhoto(VISIT, 'file:///a.jpg');
    const remaining = useChecklistDraft.getState().drafts[VISIT]!.pending_photos;
    expect(remaining).toHaveLength(1);
    expect(remaining[0]!.uri).toBe('file:///b.jpg');
  });

  it('adds and removes unchecked areas by index', () => {
    const store = useChecklistDraft.getState();
    store.addUncheckedArea(VISIT, 'Storage room');
    store.addUncheckedArea(VISIT, 'Roof terrace');
    store.removeUncheckedArea(VISIT, 0);

    expect(useChecklistDraft.getState().drafts[VISIT]!.unchecked_areas).toEqual(['Roof terrace']);
  });

  it('keeps drafts for different visits separate', () => {
    const store = useChecklistDraft.getState();
    store.setObservation(VISIT, 'kitchen', { rating: 'good' });
    store.setObservation('visit-2', 'kitchen', { rating: 'concern' });

    const drafts = useChecklistDraft.getState().drafts;
    expect(drafts[VISIT]!.observations.kitchen!.rating).toBe('good');
    expect(drafts['visit-2']!.observations.kitchen!.rating).toBe('concern');
  });

  it('clears a draft once its report is submitted', () => {
    const store = useChecklistDraft.getState();
    store.setObservation(VISIT, 'kitchen', { rating: 'good' });
    store.clear(VISIT);
    expect(useChecklistDraft.getState().drafts[VISIT]).toBeUndefined();
  });
});
