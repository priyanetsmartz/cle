import React, { useState, useEffect } from 'react';
import { PostData, GetComments } from '../../redux/pages/magazineList';
import { useParams } from "react-router-dom";
import IntlMessages from "../../components/utility/intlMessages";
import Item from 'antd/lib/list/Item';
import notification from '../../components/notification';

function SinglePost() {

    const [post, setPost] = useState({
        title:"",
        post_thumbnail:"",
        full_content:""
    });
    const [comments, setComments] = useState([]);
    const { slug } = useParams();

    useEffect(() => {
        async function getData() {
            let result: any = await PostData(slug);
            setPost(result.data[0]);
            getPostComments(result.data.post_id);
        }
        getData()
    }, [])

    const getPostComments = async (postId) => {
        let result: any = await GetComments(postId);
        setComments(result.data)
    }

    return (
        <div>
            <h2>{post.title}</h2>
            <img src={post.post_thumbnail} />
            <p>{post.full_content}</p>
        </div>
    );
}

export default SinglePost;
