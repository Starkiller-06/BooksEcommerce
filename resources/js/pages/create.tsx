import Stepper, { Step } from '@/components/Stepper';
import AdminLayout from '@/layouts/admin-layout';
import { useForm } from '@inertiajs/react';
import { PlusCircle, XCircle, Upload } from 'lucide-react';
import { useState } from 'react';
import '../../css/createBook.css';

interface Author {
    id: number;
    name: string;
}

interface Genre {
    id: number;
    genre: string;
}

interface Publisher {
    id: number;
    publisher: string;
}

interface BookFormData {
    title: string;
    isbn: string;
    synopsis: string;
    publish_year: number;
    unit_price: string;
    quantity: number;
    format: 'hardcover' | 'paperback' | '';
    edition: string;
    description: string;
    publisher_id: string;
    new_publisher_name: string;
    genre_ids: string[];
    new_genres: string[];
    author_ids: string[];
    new_authors: { name: string }[];
    cover_url: File | string | null; 
    _method?: string; 
}

interface CreateBookProps {
    authors?: Author[];
    genres?: Genre[];
    publishers?: Publisher[];
    book?: BookFormData & { id: number }; 
    isEditing?: boolean;
    onSave?: () => void;
}

export default function Create({
    authors = [],
    genres = [],
    publishers = [],
    book,
    isEditing = false,
    onSave,
}: CreateBookProps) {
    
    const { data, setData, post, transform, errors } = useForm<BookFormData>({
        title: book?.title || '',
        isbn: book?.isbn || '',
        synopsis: book?.synopsis || '',
        publish_year: book?.publish_year || new Date().getFullYear(),
        unit_price: book?.unit_price || '',
        quantity: book?.quantity || 0,
        format: book?.format || '',
        edition: book?.edition || '',
        description: book?.description || '',
        publisher_id: book?.publisher_id || '',
        new_publisher_name: '',
        genre_ids: book?.genre_ids || [],
        new_genres: [],
        author_ids: book?.author_ids || [],
        new_authors: [],
        cover_url: book?.cover_url || null,
    });

    const [isCreatingPublisher, setIsCreatingPublisher] = useState<boolean>(false);
    const [isCreatingGenre, setIsCreatingGenre] = useState<boolean>(false);
    const [isCreatingAuthor, setIsCreatingAuthor] = useState<boolean>(false);
    const [tempAuthorName, setTempAuthorName] = useState('');
    const [tempGenre, setTempGenre] = useState('');

    const addNewAuthor = () => {
        if (tempAuthorName.trim()) {
            setData('new_authors', [...data.new_authors, { name: tempAuthorName }]);
            setTempAuthorName('');
        }
    };

    const addNewGenre = () => {
        if (tempGenre.trim() !== '') {
            setData('new_genres', [...data.new_genres, tempGenre]);
            setTempGenre('');
        }
    };

    const selectExisting = (type: 'genre' | 'author', id: string) => {
        if (!id) return;
        if (type === 'genre') {
            if (!data.genre_ids.includes(id)) setData('genre_ids', [...data.genre_ids, id]);
        } else {
            if (!data.author_ids.includes(id)) setData('author_ids', [...data.author_ids, id]);
        }
    };

    const removeId = (type: 'genre' | 'author', idToRemove: string) => {
        if (type === 'genre') {
            setData('genre_ids', data.genre_ids.filter(id => id !== idToRemove));
        } else {
            setData('author_ids', data.author_ids.filter(id => id !== idToRemove));
        }
    };

    const handleSubmit = () => {
        transform((data) => {
            const finalData = { ...data };
            if (tempAuthorName.trim()) finalData.new_authors = [...finalData.new_authors, { name: tempAuthorName }];
            if (tempGenre.trim()) finalData.new_genres = [...finalData.new_genres, tempGenre];

            if (isEditing) {
                finalData._method = 'put';
            }
            return finalData;
        });

        const options = {
            onSuccess: () => {
                if (onSave) onSave();
            },
            onError: (errors: any) => {
                console.error("Validation Errors:", errors);
            },
            forceFormData: true,
        };

        if (isEditing && book?.id) {
            post(`/admin/books/${book.id}`, options);
        } else {
            post('/admin/books', options);
        }
    };

    return (
        <AdminLayout>
            <div className="create-book-container">
                <div className="create-book-header">
                    <h1 className="page-title">{isEditing ? 'Edit Book' : 'Add New Book'}</h1>
                    <p className="page-subtitle">
                        {isEditing ? 'Update the product details below.' : 'Fill in the details to add a product to the catalog.'}
                    </p>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px' }}>
                        <strong>Please check the form for errors.</strong>
                    </div>
                )}

                <Stepper
                    initialStep={1}
                    onFinalStepCompleted={handleSubmit}
                    backButtonText="Back"
                    nextButtonText={isEditing ? "Update" : "Next"}
                    className="stepper-layout-override"
                    stepCircleContainerClassName="stepper-card-override"
                >
                    <Step>
                        <div className="step-container">
                            <h2 className="section-title">Step 1: General Book Info</h2>
                            <div className="input-group" style={{ marginBottom: '24px' }}>
                                <label className="form-label">Title</label>
                                <input type="text" className="form-input" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                {errors.title && <p className="error-msg">{errors.title}</p>}
                            </div>
                            <div className="form-grid">
                                <div className="input-group">
                                    <label className="form-label">ISBN</label>
                                    <input type="text" className="form-input" value={data.isbn} onChange={(e) => setData('isbn', e.target.value)} />
                                    {errors.isbn && <p className="error-msg text-sm text-red-500">{errors.isbn}</p>}
                                </div>
                                <div className="input-group">
                                    <label className="form-label">Publish Year</label>
                                    <input type="number" className="form-input" value={data.publish_year} onChange={(e) => setData('publish_year', parseInt(e.target.value))} />
                                    {errors.publish_year && <p className="error-msg text-sm text-red-500">{errors.publish_year}</p>}
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="form-label">Synopsis</label>
                                <textarea className="form-textarea" rows={4} value={data.synopsis} onChange={(e) => setData('synopsis', e.target.value)} />
                            </div>
                        </div>
                    </Step>

                    <Step>
                        <div className="step-container">
                            <h2 className="section-title">Step 2: Product & Inventory</h2>
                            <div className="form-grid">
                                <div className="input-group">
                                    <label className="form-label">Unit Price ($)</label>
                                    <input type="number" step="0.01" className="form-input" value={data.unit_price} onChange={(e) => setData('unit_price', e.target.value)} />
                                    {errors.unit_price && <p className="error-msg text-sm text-red-500">{errors.unit_price}</p>}
                                </div>
                                <div className="input-group">
                                    <label className="form-label">Stock Quantity</label>
                                    <input type="number" min="0" className="form-input" value={data.quantity} onChange={(e) => setData('quantity', parseInt(e.target.value) || 0)} />
                                    {errors.quantity && <p className="error-msg">{errors.quantity}</p>}
                                </div>
                            </div>
                            <div className="form-grid">
                                <div className="input-group">
                                    <label className="form-label">Format</label>
                                    <select className="form-select" value={data.format} onChange={(e) => setData('format', e.target.value as any)}>
                                        <option value="">Select Format...</option>
                                        <option value="hardcover">Hardcover</option>
                                        <option value="paperback">Paperback</option>
                                    </select>
                                    {errors.format && <p className="error-msg">{errors.format}</p>}
                                </div>
                                <div className="input-group">
                                    <label className="form-label">Edition</label>
                                    <input type="text" className="form-input" value={data.edition} onChange={(e) => setData('edition', e.target.value)} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-textarea" rows={3} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            </div>
                        </div>
                    </Step>

                    <Step>
                        <div className="step-container">
                            <h2 className="section-title">Step 3: Publisher & Genre</h2>
                            
                            {/* Publisher */}
                            <div className="card-box" style={{ marginBottom: '1.5rem' }}>
                                <div className="card-header">
                                    <label className="form-label">Publisher</label>
                                    <button type="button" onClick={() => setIsCreatingPublisher(!isCreatingPublisher)} className="toggle-btn">
                                        {isCreatingPublisher ? 'Select Existing' : '+ Create New'}
                                    </button>
                                </div>
                                {isCreatingPublisher ? (
                                    <input type="text" placeholder="Enter new publisher" className="form-input" value={data.new_publisher_name} onChange={(e) => setData('new_publisher_name', e.target.value)} />
                                ) : (
                                    <select className="form-select" value={data.publisher_id} onChange={(e) => setData('publisher_id', e.target.value)}>
                                        <option value="">Select Publisher...</option>
                                        {publishers.map((pub) => <option key={pub.id} value={pub.id}>{pub.publisher}</option>)}
                                    </select>
                                )}
                                {errors.publisher_id && <p className="error-msg">{errors.publisher_id}</p>}
                                {errors.new_publisher_name && <p className="error-msg">{errors.new_publisher_name}</p>}
                            </div>

                            <div className="card-box">
                                <div className="card-header">
                                    <label className="form-label">Genres</label>
                                    <button type="button" onClick={() => setIsCreatingGenre(!isCreatingGenre)} className="toggle-btn">
                                        {isCreatingGenre ? 'Select Existing' : '+ Create New'}
                                    </button>
                                </div>
                                {isCreatingGenre ? (
                                    <div className="new-author-row">
                                        <input type="text" className="form-input" value={tempGenre} onChange={(e) => setTempGenre(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addNewGenre()} />
                                        <button type="button" onClick={addNewGenre} className="icon-btn"><PlusCircle size={24} /></button>
                                    </div>
                                ) : (
                                    <select className="form-select" value="" onChange={(e) => selectExisting('genre', e.target.value)}>
                                        <option value="">Add Genre...</option>
                                        {genres.map((gen) => <option key={gen.id} value={gen.id}>{gen.genre}</option>)}
                                    </select>
                                )}
                                <div className="added-list" style={{ marginTop: '10px' }}>
                                    {data.genre_ids.map((id) => {
                                        const g = genres.find(g => String(g.id) === String(id));
                                        return g ? <div key={id} className="added-item" style={{backgroundColor: '#c598984d', color:'#A35C5C'}}><span>{g.genre}</span><button type="button" className="remove-btn" onClick={() => removeId('genre', String(id))}><XCircle size={18}/></button></div> : null;
                                    })}
                                    {data.new_genres.map((name, i) => <div key={i} className="added-item"><span>New: <strong>{name}</strong></span><button type="button" className="remove-btn" onClick={() => setData('new_genres', data.new_genres.filter((_, idx) => idx !== i))}><XCircle size={18}/></button></div>)}
                                </div>
                                {errors.genre_ids && <p className="error-msg">{errors.genre_ids}</p>}
                                {errors.new_genres && <p className="error-msg">{errors.new_genres}</p>}
                            </div>
                        </div>
                    </Step>

                    <Step>
                        <div className="step-container">
                            <h2 className="section-title">Step 4: Authors</h2>
                            <div className="card-box">
                                <div className="card-header">
                                    <label className="form-label">Authors</label>
                                    <button type="button" onClick={() => setIsCreatingAuthor(!isCreatingAuthor)} className="toggle-btn">
                                        {isCreatingAuthor ? 'Select Existing' : '+ Create New'}
                                    </button>
                                </div>
                                {isCreatingAuthor ? (
                                    <div className="new-author-row">
                                        <input className="form-input" value={tempAuthorName} onChange={(e) => setTempAuthorName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addNewAuthor()} />
                                        <button type="button" onClick={addNewAuthor} className="icon-btn"><PlusCircle size={24} /></button>
                                    </div>
                                ) : (
                                    <select className="form-select" value="" onChange={(e) => selectExisting('author', e.target.value)}>
                                        <option value="">Add Author...</option>
                                        {authors.map((auth) => <option key={auth.id} value={auth.id}>{auth.name}</option>)}
                                    </select>
                                )}
                                <div className="added-list" style={{ marginTop: '10px' }}>
                                    {data.author_ids.map((id) => {
                                        const a = authors.find(a => String(a.id) === String(id));
                                        return a ? <div key={id} className="added-item" style={{backgroundColor: '#c598984d', color:'#A35C5C'}}><span>{a.name}</span><button type="button" className="remove-btn" onClick={() => removeId('author', String(id))}><XCircle size={18}/></button></div> : null;
                                    })}
                                    {data.new_authors.map((auth, i) => <div key={i} className="added-item"><span>New: <strong>{auth.name}</strong></span><button type="button" className="remove-btn" onClick={() => setData('new_authors', data.new_authors.filter((_, idx) => idx !== i))}><XCircle size={18}/></button></div>)}
                                </div>
                                {errors.author_ids && <p className="error-msg">{errors.author_ids}</p>}
                                {errors.new_authors && <p className="error-msg">{errors.new_authors}</p>}
                            </div>
                        </div>
                    </Step>

                    <Step>
                        <div className="step-container" style={{ textAlign: 'center' }}>
                            <h2 className="section-title" style={{ color: 'var(--accent-secondary)' }}>Summary & {isEditing ? 'Update' : 'Publish'}</h2>
                            <div className="preview-box">
                                <p><strong>Title:</strong> {data.title}</p>
                                <p><strong>ISBN:</strong> {data.isbn}</p>
                                <p><strong>Format:</strong> {data.format}</p>
                                <p><strong>Genres:</strong> {data.genre_ids.length + data.new_genres.length} selected</p>
                                <p><strong>Authors:</strong> {data.author_ids.length + data.new_authors.length} selected</p>
                            </div>

                            <div className="input-group" style={{ textAlign: 'left', marginTop: '20px' }}>
                                <label className="form-label">Cover Image</label>
                                
                                <input 
                                    type="file" 
                                    id="cover_upload"
                                    accept="image/*"
                                    className="hidden"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setData('cover_url', e.target.files[0]);
                                        }
                                    }} 
                                />

                                <label htmlFor="cover_upload" className="upload-box" style={{ 
                                    border: '2px dashed #ccc', 
                                    padding: '20px', 
                                    borderRadius: '8px', 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '10px',
                                    textAlign: 'center',
                                    backgroundColor: '#f9f9f9',
                                    transition: 'background-color 0.2s',
                                    marginTop: '0.5rem'
                                }}>
                                    <Upload size={24} color="#666" />
                                    <span style={{color: '#666', fontSize: '0.9rem'}}>
                                        {data.cover_url instanceof File ? data.cover_url.name : 'Click to select an image'}
                                    </span>
                                </label>

                                {errors.cover_url && <p className="error-msg">{errors.cover_url}</p>}

                                <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'center'}}>
                                    {data.cover_url && (
                                        typeof data.cover_url === 'string' ? (
                                            <img src={`/storage/${data.cover_url}`} alt="Current Cover" className="preview-img" style={{maxHeight: '200px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                                        ) : (
                                            <img src={URL.createObjectURL(data.cover_url)} alt="New Cover Preview" className="preview-img" style={{maxHeight: '200px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </Step>
                </Stepper>
            </div>
        </AdminLayout>
    );
}