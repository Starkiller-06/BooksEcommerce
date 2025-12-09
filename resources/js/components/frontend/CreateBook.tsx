import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Stepper, { Step } from '@/components/Stepper'; 
import { PlusCircle, XCircle } from 'lucide-react';
import '../../../css/createBook.css'; 

// --- Interfaces ---
interface Author {
    id: number;
    first_name: string;
    last_name: string;
}

interface Genre {
    id: number;
    genre: string;
}

interface Publisher {
    id: number;
    publisher: string;
}

interface CreateBookProps {
    authors?: Author[];
    genres?: Genre[];
    publishers?: Publisher[];
}

interface BookFormData {
    title: string;
    isbn: string;
    description: string;
    publish_year: number;
    unit_price: string;
    publisher_id: string;
    genre_id: string;
    author_ids: string[];
    new_publisher_name: string;
    new_genre_name: string;
    new_authors: { first_name: string; last_name: string }[];
    cover_url: string;
}

export default function CreateBook({ authors = [], genres = [], publishers = [] }: CreateBookProps) {
    
    const { data, setData, post, errors } = useForm<BookFormData>({
        title: '',
        isbn: '',
        description: '',
        publish_year: new Date().getFullYear(),
        unit_price: '',
        publisher_id: '',
        genre_id: '',
        author_ids: [],
        new_publisher_name: '',
        new_genre_name: '',
        new_authors: [], 
        cover_url: ''
    });

    const [isCreatingPublisher, setIsCreatingPublisher] = useState<boolean>(false);
    const [isCreatingGenre, setIsCreatingGenre] = useState<boolean>(false);
    const [tempAuthor, setTempAuthor] = useState({ first_name: '', last_name: '' });

    const addNewAuthor = () => {
        if(tempAuthor.first_name && tempAuthor.last_name) {
            setData('new_authors', [...data.new_authors, tempAuthor]);
            setTempAuthor({ first_name: '', last_name: '' });
        }
    };

    const handleSubmit = () => {
        post(route('books.store'), {
            onSuccess: () => console.log("Book Created!"),
        });
    };

    return (
        <div className="create-book-container">
            {/* Header */}
            <div className="create-book-header">
                <h1 className="page-title">Add New Book</h1>
                <p className="page-subtitle">Fill in the details to add a product to the catalog.</p>
            </div>

            {/* Stepper with the Layout Fixes */}
            <Stepper
                initialStep={1}
                onFinalStepCompleted={handleSubmit}
                backButtonText="Back"
                nextButtonText="Next"
                
                // FIX 1: Removes the floating/centered layout
                className="stepper-layout-override"
                
                // FIX 2: Expands width to 100% and fixes border
                stepCircleContainerClassName="stepper-card-override"
            >
                {/* --- STEP 1: BASIC INFO --- */}
                <Step>
                    <div className="step-container">
                        <h2 className="section-title">Book Details</h2>
                        
                        <div className="form-grid">
                            <div className="input-group">
                                <label className="form-label">Title</label>
                                <input 
                                    type="text" 
                                    className="form-input"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                />
                                {errors.title && <p className="error-msg">{errors.title}</p>}
                            </div>
                            <div className="input-group">
                                <label className="form-label">ISBN</label>
                                <input 
                                    type="text" 
                                    className="form-input"
                                    value={data.isbn}
                                    onChange={e => setData('isbn', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="input-group">
                                <label className="form-label">Price</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    className="form-input"
                                    value={data.unit_price}
                                    onChange={e => setData('unit_price', e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <label className="form-label">Publish Year</label>
                                <input 
                                    type="number" 
                                    className="form-input"
                                    value={data.publish_year}
                                    onChange={e => setData('publish_year', parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="form-label">Description</label>
                            <textarea 
                                className="form-textarea"
                                rows={3}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            />
                        </div>
                    </div>
                </Step>

                {/* --- STEP 2: METADATA --- */}
                <Step>
                    <div className="step-container">
                        <h2 className="section-title">Publisher & Genre</h2>

                        {/* Publisher Section */}
                        <div className="card-box" style={{ marginBottom: '1.5rem' }}>
                            <div className="card-header">
                                <label className="form-label">Publisher</label>
                                <button 
                                    type="button"
                                    onClick={() => setIsCreatingPublisher(!isCreatingPublisher)}
                                    className="toggle-btn"
                                >
                                    {isCreatingPublisher ? "Select Existing" : "+ Create New"}
                                </button>
                            </div>

                            {isCreatingPublisher ? (
                                <input 
                                    type="text" 
                                    placeholder="Enter new publisher name"
                                    className="form-input"
                                    value={data.new_publisher_name}
                                    onChange={e => setData('new_publisher_name', e.target.value)}
                                />
                            ) : (
                                <select 
                                    className="form-select"
                                    value={data.publisher_id}
                                    onChange={e => setData('publisher_id', e.target.value)}
                                >
                                    <option value="">Select a Publisher...</option>
                                    {publishers.map(pub => (
                                        <option key={pub.id} value={pub.id}>{pub.publisher}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Genre Section */}
                        <div className="card-box">
                            <div className="card-header">
                                <label className="form-label">Genre</label>
                                <button 
                                    type="button"
                                    onClick={() => setIsCreatingGenre(!isCreatingGenre)}
                                    className="toggle-btn"
                                >
                                    {isCreatingGenre ? "Select Existing" : "+ Create New"}
                                </button>
                            </div>

                            {isCreatingGenre ? (
                                <input 
                                    type="text" 
                                    placeholder="Enter new genre name"
                                    className="form-input"
                                    value={data.new_genre_name}
                                    onChange={e => setData('new_genre_name', e.target.value)}
                                />
                            ) : (
                                <select 
                                    className="form-select"
                                    value={data.genre_id}
                                    onChange={e => setData('genre_id', e.target.value)}
                                >
                                    <option value="">Select a Genre...</option>
                                    {genres.map(gen => (
                                        <option key={gen.id} value={gen.id}>{gen.genre}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                </Step>

                {/* --- STEP 3: AUTHORS --- */}
                <Step>
                    <div className="step-container">
                        <h2 className="section-title">Authors</h2>
                        
                        <div className="input-group">
                            <label className="form-label">Select Existing Authors</label>
                            <select 
                                multiple
                                className="multi-select"
                                value={data.author_ids}
                                onChange={e => {
                                    const options = Array.from(e.target.selectedOptions);
                                    const values = options.map(option => option.value);
                                    setData('author_ids', values);
                                }}
                            >
                                {authors.map(auth => (
                                    <option key={auth.id} value={auth.id}>
                                        {auth.first_name} {auth.last_name}
                                    </option>
                                ))}
                            </select>
                            <p style={{fontSize: '0.8rem', color: '#6b7280'}}>Hold Ctrl/Cmd to select multiple.</p>
                        </div>

                        <div className="card-box" style={{ marginTop: '1.5rem' }}>
                            <h3 className="form-label">Or Add New Author:</h3>
                            <div className="new-author-row">
                                <input 
                                    placeholder="First Name" 
                                    className="form-input"
                                    value={tempAuthor.first_name}
                                    onChange={e => setTempAuthor({...tempAuthor, first_name: e.target.value})}
                                />
                                <input 
                                    placeholder="Last Name" 
                                    className="form-input"
                                    value={tempAuthor.last_name}
                                    onChange={e => setTempAuthor({...tempAuthor, last_name: e.target.value})}
                                />
                                <button 
                                    type="button"
                                    onClick={addNewAuthor}
                                    className="icon-btn"
                                >
                                    <PlusCircle size={24} />
                                </button>
                            </div>

                            {data.new_authors.length > 0 && (
                                <div className="added-list">
                                    {data.new_authors.map((auth, idx) => (
                                        <div key={idx} className="added-item">
                                            <span>New: <strong>{auth.first_name} {auth.last_name}</strong></span>
                                            <button 
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => {
                                                    const newArr = data.new_authors.filter((_, i) => i !== idx);
                                                    setData('new_authors', newArr);
                                                }}
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Step>

                {/* --- STEP 4: PREVIEW --- */}
                <Step>
                    <div className="step-container" style={{ textAlign: 'center' }}>
                        <h2 className="section-title" style={{ color: 'var(--accent-secondary)' }}>
                            Ready to Publish?
                        </h2>
                        
                        <div className="preview-box">
                            <p><strong>Title:</strong> {data.title}</p>
                            <p><strong>Price:</strong> ${data.unit_price}</p>
                            <p><strong>Authors:</strong> {data.author_ids.length} existing, {data.new_authors.length} new.</p>
                        </div>
                        
                        <div className="input-group" style={{ textAlign: 'left' }}>
                           <label className="form-label">Cover Image URL</label>
                           <input 
                               placeholder="https://example.com/image.jpg"
                               className="form-input"
                               value={data.cover_url}
                               onChange={e => setData('cover_url', e.target.value)}
                           />
                           {data.cover_url && (
                               <img src={data.cover_url} alt="Preview" className="preview-img" />
                           )}
                        </div>
                    </div>
                </Step>
            </Stepper>
        </div>
    );
}